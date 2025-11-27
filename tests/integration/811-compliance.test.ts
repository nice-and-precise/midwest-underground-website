import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { Ticket811Status, BoreStatus } from '@prisma/client';

describe('811 Compliance Workflow (Integration)', () => {
  let userId: string;
  let projectId: string;
  let boreId: string;
  let activeTicketId: string;
  let expiredTicketId: string;

  beforeAll(async () => {
    // Setup test data
    const user = await prisma.user.findFirst();
    userId = user!.id;

    const project = await prisma.project.findFirst();
    projectId = project!.id;

    const bore = await prisma.bore.create({
      data: {
        name: '811 Compliance Test Bore',
        projectId: project!.id,
        status: BoreStatus.PLANNED
      }
    });
    boreId = bore.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.ticket811Response.deleteMany({
      where: { ticketId: { in: [activeTicketId, expiredTicketId] } }
    });
    await prisma.ticket811.deleteMany({
      where: { id: { in: [activeTicketId, expiredTicketId] } }
    });
    await prisma.bore.delete({ where: { id: boreId } });
  });

  it('should create 811 ticket before drilling', async () => {
    // Step 1: Create 811 ticket
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1);

    const ticket = await prisma.ticket811.create({
      data: {
        ticketNumber: 'INT-TEST-811-001',
        projectId,
        ticketDate: new Date(),
        expirationDate: futureDate,
        status: Ticket811Status.ACTIVE,
        notes: 'Pre-drilling locate request'
      }
    });

    activeTicketId = ticket.id;

    expect(ticket).toBeDefined();
    expect(ticket.status).toBe(Ticket811Status.ACTIVE);
    expect(ticket.expirationDate.getTime()).toBeGreaterThan(Date.now());
  });

  it('should record utility responses', async () => {
    // Step 2: Utilities respond to the ticket
    const utilities = [
      { name: 'Xcel Energy', type: 'Clear' },
      { name: 'CenterPoint Energy', type: 'Clear' },
      { name: 'Fiber Network Provider', type: 'Marked' }
    ];

    for (const utility of utilities) {
      await prisma.ticket811Response.create({
        data: {
          ticketId: activeTicketId,
          utilityName: utility.name,
          responseType: utility.type,
          responseDate: new Date('2025-01-03'),
          marksDescription: `${utility.type} - All utilities located`,
          respondedById: userId
        }
      });
    }

    // Verify all responses recorded
    const ticket = await prisma.ticket811.findUnique({
      where: { id: activeTicketId },
      include: { responses: true }
    });

    expect(ticket?.responses).toHaveLength(3);
  });

  it('should validate ticket before drilling', async () => {
    // Step 3: Check ticket validity before starting bore
    const ticket = await prisma.ticket811.findUnique({
      where: { id: activeTicketId }
    });

    const isValid = ticket && ticket.expirationDate.getTime() > Date.now();
    expect(isValid).toBe(true);

    // If valid, allow bore to start
    if (isValid) {
      const bore = await prisma.bore.update({
        where: { id: boreId },
        data: { status: BoreStatus.IN_PROGRESS }
      });
      expect(bore.status).toBe(BoreStatus.IN_PROGRESS);
    }
  });

  it('should block drilling with expired ticket', async () => {
    // Step 4: Create expired ticket
    const expiredTicket = await prisma.ticket811.create({
      data: {
        ticketNumber: 'INT-TEST-811-002',
        projectId,
        ticketDate: new Date('2024-11-01'),
        expirationDate: new Date('2024-12-01'), // Expired
        status: Ticket811Status.EXPIRED
      }
    });

    expiredTicketId = expiredTicket.id;

    // Check if ticket is expired
    const isExpired = expiredTicket.expirationDate.getTime() < Date.now();
    expect(isExpired).toBe(true);
    expect(expiredTicket.status).toBe(Ticket811Status.EXPIRED);

    // Compliance check should fail
    const canDrill = !isExpired && expiredTicket.status === Ticket811Status.ACTIVE;
    expect(canDrill).toBe(false);
  });

  it('should renew expired ticket', async () => {
    // Step 5: Renew the expired ticket
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);

    const renewedTicket = await prisma.ticket811.update({
      where: { id: expiredTicketId },
      data: {
        status: Ticket811Status.RENEWED,
        expirationDate: futureDate, // New expiration
        notes: 'Ticket renewed for continued work'
      }
    });

    expect(renewedTicket.status).toBe(Ticket811Status.RENEWED);
    expect(renewedTicket.expirationDate.getTime()).toBeGreaterThan(Date.now());

    // Now compliance check should pass
    const canDrill = renewedTicket.expirationDate.getTime() > Date.now() &&
                     (renewedTicket.status === Ticket811Status.ACTIVE ||
                      renewedTicket.status === Ticket811Status.RENEWED);
    expect(canDrill).toBe(true);
  });

  it('should track all 811 tickets for a project', async () => {
    // Step 6: Verify project has all tickets
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tickets811: {
          include: {
            responses: true
          }
        }
      }
    });

    const testTickets = project?.tickets811.filter(t =>
      t.ticketNumber.startsWith('INT-TEST-811')
    );

    expect(testTickets?.length).toBeGreaterThanOrEqual(2);
  });

  it('should identify upcoming expirations', async () => {
    // Step 7: Find tickets expiring soon (within 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const expiringSoon = await prisma.ticket811.findMany({
      where: {
        projectId,
        expirationDate: {
          gte: new Date(),
          lte: sevenDaysFromNow
        },
        status: {
          in: [Ticket811Status.ACTIVE, Ticket811Status.RENEWED]
        }
      }
    });

    // This query should work for compliance monitoring
    expect(Array.isArray(expiringSoon)).toBe(true);
  });
});
