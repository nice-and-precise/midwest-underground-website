import { ProjectStatus } from '@prisma/client';

export const validProjectPayload = {
  name: 'Test Fiber Installation',
  description: 'Test project for fiber installation',
  customerName: 'Test Customer Inc',
  status: ProjectStatus.PLANNING,
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-12-31'),
  budget: 50000.0,
};

export const invalidProjectPayloads = {
  missingRequired: {
    description: 'Missing name',
    // name is required
  },
  invalidStatus: {
    name: 'Invalid Status',
    status: 'INVALID_STATUS',
  },
  emptyName: {
    name: '',
  },
};

export const updateProjectPayload = {
  status: ProjectStatus.COMPLETED,
  actualEndDate: new Date('2025-06-30'),
};
