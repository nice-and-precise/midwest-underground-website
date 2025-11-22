import { BoreStatus } from '@prisma/client';

export const validBorePayload = (projectId: string) => ({
  name: 'BORE-TEST-001',
  projectId,
  status: BoreStatus.PLANNED,
  totalLength: 500.0,
  diameterIn: 4.0,
  productMaterial: 'HDPE',
});

export const invalidBorePayloads = {
  missingProjectId: {
    name: 'BORE-TEST-002',
    // projectId is required
  },
  invalidLength: {
    name: 'BORE-TEST-003',
    totalLength: -100, // Invalid negative length
  },
  missingName: {
    projectId: 'test-project-id',
    // name is required
  },
};

export const updateBorePayload = {
  status: BoreStatus.IN_PROGRESS,
  totalLength: 505.5,
};
