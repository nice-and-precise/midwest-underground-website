import { test, expect } from '@playwright/test';

test.describe('API Security E2E Tests', () => {
  test.describe('Authentication Required Endpoints', () => {
    const protectedEndpoints = [
      '/api/projects',
      '/api/bore-logs',
      '/api/customers',
      '/api/equipment',
      '/api/estimates',
      '/api/field-reports',
      '/api/hdd/daily-reports',
      '/api/hdd/rod-passes',
      '/api/inspections'
    ];

    for (const endpoint of protectedEndpoints) {
      test(`${endpoint} should require authentication`, async ({ request }) => {
        const response = await request.get(endpoint);
        expect(response.status()).toBe(401);

        const body = await response.json().catch(() => ({}));
        expect(body.error).toBeDefined();
      });
    }
  });

  test.describe('Request Method Validation', () => {
    test('should reject unsupported HTTP methods', async ({ request }) => {
      // OPTIONS should work (for CORS preflight)
      // DELETE on collection endpoint without ID should fail
      const response = await request.delete('/api/projects');
      expect([400, 401, 404, 405]).toContain(response.status());
    });
  });

  test.describe('Input Validation on POST', () => {
    test('contact form should validate email format', async ({ request }) => {
      const response = await request.post('/api/contact', {
        data: {
          name: 'Test User',
          email: 'invalid-email',
          message: 'Test message'
        }
      });

      // Should return validation error
      expect(response.status()).toBe(400);
    });

    test('contact form should require all fields', async ({ request }) => {
      const response = await request.post('/api/contact', {
        data: {
          name: 'Test User'
          // Missing email and message
        }
      });

      expect(response.status()).toBe(400);
    });

    test('contact form should accept valid data', async ({ request }) => {
      const response = await request.post('/api/contact', {
        data: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message'
        }
      });

      // Should succeed
      expect([200, 201]).toContain(response.status());
    });
  });

  test.describe('API Response Format', () => {
    test('should return JSON content type', async ({ request }) => {
      const response = await request.get('/api/projects');
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('application/json');
    });

    test('error responses should have consistent format', async ({ request }) => {
      const response = await request.get('/api/projects');
      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body).toHaveProperty('error');
    });
  });

  test.describe('SQL Injection Prevention', () => {
    test('should handle SQL injection attempts in query params', async ({ request }) => {
      const maliciousParams = [
        '1; DROP TABLE users;--',
        "1' OR '1'='1",
        '1 UNION SELECT * FROM users--'
      ];

      for (const param of maliciousParams) {
        const response = await request.get(`/api/bore-logs/${encodeURIComponent(param)}`);
        // Should either 401 (unauthorized) or 400/404 (validation/not found)
        // Should NOT return 500 (server error from SQL)
        expect([400, 401, 404]).toContain(response.status());
      }
    });
  });

  test.describe('Path Traversal Prevention', () => {
    test('should prevent path traversal in IDs', async ({ request }) => {
      const maliciousIds = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32',
        '%2e%2e%2f%2e%2e%2f'
      ];

      for (const id of maliciousIds) {
        const response = await request.get(`/api/projects/${encodeURIComponent(id)}`);
        expect([400, 401, 404]).toContain(response.status());
      }
    });
  });

  test.describe('Large Payload Handling', () => {
    test('should reject oversized payloads', async ({ request }) => {
      // Create a large payload (1MB+)
      const largeString = 'x'.repeat(1024 * 1024);

      const response = await request.post('/api/contact', {
        data: {
          name: 'Test',
          email: 'test@example.com',
          message: largeString
        }
      });

      // Should either reject with 413 (payload too large) or 400 (validation)
      expect([400, 413]).toContain(response.status());
    });
  });
});
