import { Ticket811Status } from '@prisma/client';

export const validTicketPayload = (projectId: string) => ({
  ticketNumber: '811-TEST-001',
  projectId,
  ticketDate: new Date('2025-01-01'),
  expirationDate: new Date('2025-02-05'),
  status: Ticket811Status.ACTIVE,
  notes: 'Test 811 ticket',
});

export const expiredTicketPayload = (projectId: string) => ({
  ticketNumber: '811-TEST-002',
  projectId,
  ticketDate: new Date('2024-11-01'),
  expirationDate: new Date('2024-12-05'), // Expired
  status: Ticket811Status.EXPIRED,
  notes: 'Expired 811 ticket',
});

export const utilityResponsePayload = {
  utilityCompany: 'Xcel Energy',
  responseDate: new Date('2025-01-03'),
  clearanceGranted: true,
  notes: 'All clear for drilling',
};
