import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, withRateLimitHeaders } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/**
 * POST /api/contact
 * Handle contact form submissions
 */
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting (5 submissions per hour)
    const rateLimitResult = rateLimit(request, 'contact');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      return withRateLimitHeaders(
        NextResponse.json(
          {
            error: 'Validation Error',
            details: validationResult.error.flatten().fieldErrors,
          },
          { status: 400 }
        ),
        rateLimitResult.headers
      );
    }

    const { name, email, phone, service, message } = validationResult.data;

    // Store contact submission in database
    const contact = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        service: service || null,
        message,
      },
    });

    // Log the submission for audit purposes
    console.log(`[Contact Form] New submission from ${email} - ID: ${contact.id}`);

    // In production, you would also:
    // 1. Send email notification to admin
    // 2. Send confirmation email to user
    // 3. Integrate with CRM or ticketing system

    const response = NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message. We will get back to you soon!',
        id: contact.id,
      },
      { status: 201 }
    );

    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Contact Form] Error:', error);

    // Check for specific Prisma errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        {
          error: 'Duplicate Submission',
          message: 'A contact request with this email already exists. We will be in touch soon.',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: 'Server Error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contact
 * Get all contact submissions (protected - requires auth)
 */
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request, 'read');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    // Get contact submissions
    const contacts = await prisma.contactSubmission.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    const response = NextResponse.json(contacts);
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Contact API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
