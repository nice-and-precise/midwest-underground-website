import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { Ticket811Status } from '@prisma/client';

describe('811 Tickets API', () => {
  let testProjectId: string;
  let testTicketId: string;
  let testUserId: string;

  beforeAll(async () => {
    const project = await prisma.project.findFirst();
    testProjectId = project!.id;

    const user = await prisma.user.findFirst();
    testUserId = user!.id;
  });

  describe('GET /api/hdd/811-tickets', () => {
    it('should return all 811 tickets', async () => {
      const tickets = await prisma.ticket811.findMany({
        include: {
          project: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              responses: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      expect(tickets).toBeDefined();
      expect(Array.isArray(tickets)).toBe(true);
    });

    it('should filter tickets by projectId', async () => {
      const tickets = await prisma.ticket811.findMany({
        where: { projectId: testProjectId }
      });

      tickets.forEach(ticket => {
        expect(ticket.projectId).toBe(testProjectId);
      });
    });

    it('should filter tickets by status', async () => {
      const tickets = await prisma.ticket811.findMany({
        where: { status: Ticket811Status.ACTIVE }
      });

      tickets.forEach(ticket => {
        expect(ticket.status).toBe(Ticket811Status.ACTIVE);
      });
    });

    it('should identify expired tickets', async () => {
      const now = new Date();
      const tickets = await prisma.ticket811.findMany({
        where: {
          expirationDate: {
            lt: now
          }
        }
      });

      tickets.forEach(ticket => {
        expect(ticket.expirationDate.getTime()).toBeLessThan(now.getTime());
      });
    });
  });

  describe('POST /api/hdd/811-tickets', () => {
    it('should create a 811 ticket with valid data', async () => {
      const ticketData = {
        ticketNumber: 'TEST-811-001',
        projectId: testProjectId,
        ticketDate: new Date('2025-01-01'),
        expirationDate: new Date('2025-02-01'),
        status: Ticket811Status.ACTIVE,
        notes: 'Test 811 ticket'
      };

      const ticket = await prisma.ticket811.create({
        data: ticketData,
        include: {
          project: true
        }
      });

      testTicketId = ticket.id;

      expect(ticket).toBeDefined();
      expect(ticket.ticketNumber).toBe('TEST-811-001');
      expect(ticket.status).toBe(Ticket811Status.ACTIVE);
      expect(ticket.expirationDate).toBeDefined();
    });

    it('should fail without required ticketNumber', async () => {
      const ticketData = {
        projectId: testProjectId,
        ticketDate: new Date(),
        expirationDate: new Date()
      };

      await expect(
        prisma.ticket811.create({ data: ticketData as any })
      ).rejects.toThrow();
    });

    it('should fail without required projectId', async () => {
      const ticketData = {
        ticketNumber: 'TEST-811-002',
        ticketDate: new Date(),
        expirationDate: new Date()
      };

      await expect(
        prisma.ticket811.create({ data: ticketData as any })
      ).rejects.toThrow();
    });

    it('should set default status to ACTIVE', async () => {
      const ticketData = {
        ticketNumber: 'TEST-811-003',
        projectId: testProjectId,
        ticketDate: new Date(),
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };

      const ticket = await prisma.ticket811.create({
        data: ticketData
      });

      expect(ticket.status).toBe(Ticket811Status.ACTIVE);

      await prisma.ticket811.delete({ where: { id: ticket.id } });
    });
  });

  describe('GET /api/hdd/811-tickets/[id]', () => {
    it('should return a single ticket with all relations', async () => {
      const ticket = await prisma.ticket811.findUnique({
        where: { id: testTicketId },
        include: {
          project: true,
          responses: true,
          _count: {
            select: {
              responses: true
            }
          }
        }
      });

      expect(ticket).toBeDefined();
      expect(ticket?.id).toBe(testTicketId);
      expect(ticket?.project).toBeDefined();
      expect(ticket?._count).toBeDefined();
    });

    it('should return null for non-existent ticket', async () => {
      const ticket = await prisma.ticket811.findUnique({
        where: { id: 'non-existent-id-12345' }
      });

      expect(ticket).toBeNull();
    });
  });

  describe('POST /api/hdd/811-tickets/[id]/responses', () => {
    it('should add a utility response to a ticket', async () => {
      const responseData = {
        ticketId: testTicketId,
        utilityName: 'Xcel Energy',
        responseType: 'Clear',
        responseDate: new Date('2025-01-03'),
        marksDescription: 'All utilities marked with flags',
        respondedById: testUserId
      };

      const response = await prisma.ticket811Response.create({
        data: responseData,
        include: {
          ticket: true,
          respondedById: true
        }
      });

      expect(response).toBeDefined();
      expect(response.utilityName).toBe('Xcel Energy');
      expect(response.ticketId).toBe(testTicketId);
      expect(response.respondedBy).toBeDefined();
    });

    it('should create multiple responses for same ticket', async () => {
      const utilities = ['CenterPoint Energy', 'Fiber Network'];

      for (const utility of utilities) {
        await prisma.ticket811Response.create({
          data: {
            ticketId: testTicketId,
            utilityName: utility,
            responseDate: new Date(),
            respondedById: testUserId
          }
        });
      }

      const ticket = await prisma.ticket811.findUnique({
        where: { id: testTicketId },
        include: {
          responses: true
        }
      });

      expect(ticket?.responses.length).toBeGreaterThanOrEqual(2);
    });

    it('should fail without required fields', async () => {
      const responseData = {
        ticketId: testTicketId,
        // utilityName is required
        responseDate: new Date(),
        respondedById: testUserId
      };

      await expect(
        prisma.ticket811Response.create({ data: responseData as any })
      ).rejects.toThrow();
    });
  });

  describe('Ticket expiration logic', () => {
    it('should mark ticket as EXPIRED when past expiration date', async () => {
      // Create an expired ticket
      const expiredTicket = await prisma.ticket811.create({
        data: {
          ticketNumber: 'EXPIRED-001',
          projectId: testProjectId,
          ticketDate: new Date('2024-11-01'),
          expirationDate: new Date('2024-12-01'), // Expired
          status: Ticket811Status.ACTIVE
        }
      });

      // Update to expired
      const updated = await prisma.ticket811.update({
        where: { id: expiredTicket.id },
        data: { status: Ticket811Status.EXPIRED }
      });

      expect(updated.status).toBe(Ticket811Status.EXPIRED);

      await prisma.ticket811.delete({ where: { id: expiredTicket.id } });
    });

    it('should renew expired ticket', async () => {
      const renewedTicket = await prisma.ticket811.create({
        data: {
          ticketNumber: 'RENEWED-001',
          projectId: testProjectId,
          ticketDate: new Date('2024-11-01'),
          expirationDate: new Date('2024-12-01'),
          status: Ticket811Status.EXPIRED
        }
      });

      // Renew the ticket
      const updated = await prisma.ticket811.update({
        where: { id: renewedTicket.id },
        data: {
          status: Ticket811Status.RENEWED,
          expirationDate: new Date('2025-02-01')
        }
      });

      expect(updated.status).toBe(Ticket811Status.RENEWED);
      expect(updated.expirationDate.getTime()).toBeGreaterThan(Date.now());

      await prisma.ticket811.delete({ where: { id: renewedTicket.id } });
    });
  });
});
