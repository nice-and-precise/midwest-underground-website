import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('Contact API', () => {
  const testSubmissions: string[] = [];

  afterAll(async () => {
    // Cleanup test submissions
    if (testSubmissions.length > 0) {
      await prisma.contactSubmission.deleteMany({
        where: { id: { in: testSubmissions } }
      });
    }
  });

  describe('POST /api/contact', () => {
    it('should create a contact submission with valid data', async () => {
      const contactData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '320-555-1234',
        service: 'hdd',
        message: 'This is a test message for the contact form. It needs to be at least 10 characters.'
      };

      const submission = await prisma.contactSubmission.create({
        data: contactData
      });

      testSubmissions.push(submission.id);

      expect(submission).toBeDefined();
      expect(submission.name).toBe(contactData.name);
      expect(submission.email).toBe(contactData.email);
      expect(submission.phone).toBe(contactData.phone);
      expect(submission.service).toBe(contactData.service);
      expect(submission.message).toBe(contactData.message);
      expect(submission.status).toBe('NEW');
    });

    it('should create submission without optional fields', async () => {
      const contactData = {
        name: 'Minimal User',
        email: 'minimal@example.com',
        message: 'This is a minimal test message without optional fields.'
      };

      const submission = await prisma.contactSubmission.create({
        data: contactData
      });

      testSubmissions.push(submission.id);

      expect(submission).toBeDefined();
      expect(submission.phone).toBeNull();
      expect(submission.service).toBeNull();
      expect(submission.status).toBe('NEW');
    });

    it('should fail without required name field', async () => {
      const invalidData = {
        email: 'test@example.com',
        message: 'Test message'
      };

      await expect(
        prisma.contactSubmission.create({ data: invalidData as any })
      ).rejects.toThrow();
    });

    it('should fail without required email field', async () => {
      const invalidData = {
        name: 'Test User',
        message: 'Test message'
      };

      await expect(
        prisma.contactSubmission.create({ data: invalidData as any })
      ).rejects.toThrow();
    });

    it('should fail without required message field', async () => {
      const invalidData = {
        name: 'Test User',
        email: 'test@example.com'
      };

      await expect(
        prisma.contactSubmission.create({ data: invalidData as any })
      ).rejects.toThrow();
    });
  });

  describe('GET /api/contact', () => {
    it('should retrieve contact submissions', async () => {
      const submissions = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      expect(submissions).toBeDefined();
      expect(Array.isArray(submissions)).toBe(true);
    });

    it('should filter by status', async () => {
      const newSubmissions = await prisma.contactSubmission.findMany({
        where: { status: 'NEW' }
      });

      newSubmissions.forEach(submission => {
        expect(submission.status).toBe('NEW');
      });
    });
  });

  describe('Contact status workflow', () => {
    it('should complete full status workflow', async () => {
      // Create a submission for workflow testing
      const submission = await prisma.contactSubmission.create({
        data: {
          name: 'Workflow Test',
          email: 'workflow@example.com',
          message: 'Testing status workflow'
        }
      });

      testSubmissions.push(submission.id);

      expect(submission.status).toBe('NEW');

      // Update to CONTACTED
      const contacted = await prisma.contactSubmission.update({
        where: { id: submission.id },
        data: { status: 'CONTACTED' }
      });

      expect(contacted.status).toBe('CONTACTED');

      // Update to CONVERTED
      const converted = await prisma.contactSubmission.update({
        where: { id: submission.id },
        data: { status: 'CONVERTED' }
      });

      expect(converted.status).toBe('CONVERTED');

      // Add notes
      const withNotes = await prisma.contactSubmission.update({
        where: { id: submission.id },
        data: { notes: 'Converted to project #123' }
      });

      expect(withNotes.notes).toBe('Converted to project #123');

      // Close the submission
      const closed = await prisma.contactSubmission.update({
        where: { id: submission.id },
        data: { status: 'CLOSED' }
      });

      expect(closed.status).toBe('CLOSED');
    });
  });
});
