# Agent Coordination & Sandbox Security

> **Based on:** [SANDBOX & AGENT GUIDE.md](NEW STUFF/SANDBOX & AGENT GUIDE.md)
> **Last Updated:** 2025-11-23
> **Status:** Production Ready - Sandbox System Configured

---

## 🎯 Overview

This document defines how AI agents coordinate work on the Midwest Underground website project using **Anthropic's sandbox-runtime** for security and isolation.

### Why Sandbox?

From Anthropic's [sandbox-runtime](https://github.com/anthropic-experimental/sandbox-runtime):

1. **OS-Level Security:** Uses native primitives (sandbox-exec/macOS, bubblewrap/Linux)
2. **Secure by Default:** All access denied unless explicitly allowed
3. **Multi-Agent Safe:** Prevents agent interference through isolation
4. **Independent Operation:** No permission prompts during execution
5. **Violation Learning:** Automatically tracks blocked operations for config improvement

---

## 🏗️ Architecture

### Security Model

```
┌─────────────────────────────────────────────────────────┐
│              Host Machine (Unrestricted)                 │
│  ┌───────────────────────────────────────────────────┐  │
│  │  HTTP Proxy (8080) + SOCKS5 Proxy (1080)         │  │
│  │  Network Filtering (Domain Allowlist)            │  │
│  └────────────────┬──────────────────────────────────┘  │
│                   │ Unix Socket / localhost             │
│  ┌────────────────▼──────────────────────────────────┐  │
│  │           Sandbox Container                       │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  Agent Process                             │  │  │
│  │  │  - Network: Proxy-only access              │  │  │
│  │  │  - Filesystem: Restricted read/write       │  │  │
│  │  │  - Process: Isolated namespace             │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🤖 Agent Status & Responsibilities

### ✅ Completed Agents (Archive)

| Agent | Mission | Status | Files |
|-------|---------|--------|-------|
| **Agent 1** | Database Seeding | ✅ Complete | prisma/seed.ts |
| **Agent 2** | Authentication | ✅ Complete | src/app/(auth)/** |
| **Agent 3** | Projects/Bores API | ✅ Complete | src/app/api/projects/** |
| **Agent 4** | Reports/Passes API | ✅ Complete | src/app/api/reports/** |
| **Agent 5** | Tickets/Inspections | ✅ Complete | src/app/api/tickets/** |
| **Agent 6** | Dashboard Pages (A) | ✅ Complete | src/app/dashboard/** |
| **Agent 7** | Dashboard Pages (B) | ✅ Complete | src/app/dashboard/** |
| **Agent 8** | Advanced Features | ✅ Complete | src/app/api/kpis/** |
| **Agent 9** | Testing Suite | ✅ Complete | tests/** |

**Note:** Agent 9 remains active for regression testing.

---

## 📅 Recommended Agent Sequence

### Week 1: Critical Launch
1. **Agent 13: Deployment** (Monday-Tuesday)
2. **Agent 11: SEO** (Wednesday-Thursday)
3. **Agent 15: Security** (Friday)

### Week 2: Owner Tools
4. **Agent 10: Content** (Monday-Wednesday)
5. **Agent 12: Email** (Thursday-Friday)

### Week 3: Performance & Polish
6. **Agent 14: Performance** (Monday-Tuesday)
7. **Agent 16: Mobile** (Wednesday-Friday)

### Week 4: Training
8. **Agent 17: Documentation** (Monday-Friday)
9. **Agent 9: Final Testing** (Continuous)

---

## 📚 Related Documentation

- **[SANDBOX & AGENT GUIDE.md](NEW STUFF/SANDBOX & AGENT GUIDE.md)** - Complete setup guide
- **[MCP-SERVERS.md](MCP-SERVERS.md)** - MCP integration with sandboxing
- **[CLAUDE.md](CLAUDE.md)** - Project context

---

**Prepared by:** Claude Code
**Date:** 2025-11-23
**Version:** 1.0
