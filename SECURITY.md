# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅                 |
| < 1.0   | ❌                 |

---

## Reporting a Vulnerability

Please **do not** report security issues via public GitHub issues.

Instead, email:

- **security@midwestundergroundmn.com**

We aim to acknowledge reports within 48 hours and provide an initial assessment within 7 days.

When reporting:

- Describe the vulnerability type and impact.
- Include affected files and paths.
- Provide repro steps and proof-of-concept if possible.
- Include environment details (branch, commit, environment).

---

## Security Practices

### Authentication & Authorization

- NextAuth v5 with JWT sessions.
- httpOnly cookies for session tokens.
- bcryptjs for password hashing.
- Role-based access control:
  - OWNER
  - SUPER
  - CREW
- Protected routes enforced via middleware.

### Data Protection

- Parameterized queries via Prisma ORM.
- Input validation via Zod schemas.
- React-based rendering mitigates XSS when used correctly.
- Environment variables for secrets and connection strings.

### Infrastructure (Recommended)

- HTTPS for all environments.
- Secure headers (Content-Security-Policy, X-Frame-Options, etc.).
- Rate limiting on sensitive endpoints.
- Centralized logging and monitoring.

---

## Contribution Guidelines for Security

- Never commit secrets or credentials.
- Use environment variables for sensitive configuration.
- Validate and sanitize all user-provided data.
- Prefer existing auth and validation helpers.
- Add tests for security-sensitive code paths.

---

## Known Considerations

### Development

- Dev uses SQLite; production should use PostgreSQL or similar.
- Test credentials exist in seed data and must not be used in production.

### Production Recommendations

- Use a managed database with encryption at rest.
- Enable automated backups and restore testing.
- Use Web Application Firewall if exposed to the public internet.
- Regularly update dependencies and rerun security scans.

---

## Third-Party Dependencies

The project uses third-party libraries such as:

- Next.js
- React
- Prisma
- NextAuth
- Tailwind CSS

Keep them updated and monitor advisories.

---

## Contact

For security questions:

- **security@midwestundergroundmn.com**

For general questions:

- `info@midwestundergroundmn.com`

---

**Last Updated:** 2025-11-23
