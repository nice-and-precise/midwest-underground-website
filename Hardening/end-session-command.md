# End Session Protocol

Execute these steps before ending:

## 1. Run Full Validation
```bash
npm run lint
npm run test -- --run
npm run build
```

## 2. Commit Checkpoint
```bash
git add -A
git commit -m "checkpoint: [describe current state]"
```

## 3. Save Progress to Serena Memory
```
write_memory("session_progress", "
## Completed This Session
- [list completed tasks]

## Current State
- Branch: [current branch]
- Last task completed: [task]
- Tests: [passing/failing]

## Next Steps
1. [next task]
2. [following task]

## Blockers
- [any blockers or none]
")
```

## 4. Report Session Summary
Provide:
- Tasks completed
- Current branch and commit
- Next steps for continuation
- Any blockers or concerns
