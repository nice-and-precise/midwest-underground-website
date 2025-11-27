import { handlers } from '@/auth'

// Force Node.js runtime to avoid bcryptjs Edge Runtime warning
export const runtime = 'nodejs'

export const { GET, POST } = handlers
