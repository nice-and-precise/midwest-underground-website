import { beforeAll, afterAll } from 'vitest';

// Set test environment variables
process.env.DATABASE_URL = 'file:./prisma/test.db';
process.env.NEXTAUTH_SECRET = 'test-secret-key-for-testing-only';
process.env.NEXTAUTH_URL = 'http://localhost:3000';

// Note: Test database should be initialized manually before running tests:
// 1. export DATABASE_URL="file:./prisma/test.db"
// 2. npx prisma db push --force-reset
// 3. npx ts-node --project tsconfig.seed.json prisma/seed.ts

beforeAll(async () => {
  console.log('Using test database at file:./prisma/test.db');
});

afterAll(async () => {
  console.log('Tests completed');
});
