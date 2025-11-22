# Multi-Agent Parallel Development Strategy

## Agent Wave Structure

### Wave 1: Foundation (Sequential) ✅ COMPLETE
- Agent 1: Database Seeding → DONE

### Wave 2: Core Systems (2 Parallel Agents)
- Agent 2: Authentication Implementation
- Agent 3: Projects & Bores API
- **Can run in parallel** - no dependencies

### Wave 3: Features (4 Parallel Agents)
- Agent 4: Daily Reports & Rod Passes API
- Agent 5: 811 Tickets & Inspections API
- Agent 6: Dashboard Pages - Group A
- Agent 7: Dashboard Pages - Group B
- **Depends on:** Wave 2 completion

### Wave 4: Advanced (2 Parallel Agents)
- Agent 8: Advanced Features
- Agent 9: Testing Suite
- **Depends on:** Wave 3 completion

## Agent Communication Protocol

### Shared Context (All Agents)
- Database seeded with 66 records
- Test user: owner@midwestunderground.com / password123
- Prisma Client: `import { prisma } from '@/lib/prisma'`
- Validation: `import { schemas } from '@/lib/validations'`

### Coordination Files
1. **AGENT_COORDINATION.md** - Status board (agents update this)
2. **progress-dashboard.html** - Visual monitoring
3. **Serena Memories** - Persistent context

### Agent Responsibilities
Each agent MUST:
1. Read AGENT_COORDINATION.md before starting
2. Update status when starting work
3. Update status when completing deliverables
4. Document blockers or issues
5. Run `npm run build` before marking complete
6. Update completion in AGENT_COORDINATION.md

## Best Practices for Agents

### Use Serena MCP
- Project: midwest-underground-website (already activated)
- Read memories before starting
- Write progress to memories
- Use symbolic tools for efficient code navigation

### Use --dangerously-skip-permissions
- Run uninterrupted until completion
- No permission prompts
- Full autonomy

### Coordination
- Read other agents' status before starting
- Don't duplicate work
- Share patterns and decisions
- Document breaking changes
