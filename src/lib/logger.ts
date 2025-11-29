/**
 * Logging Utility
 * Provides structured logging for the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  error?: {
    name: string
    message: string
    stack?: string
  }
}

interface LoggerConfig {
  level: LogLevel
  enableConsole: boolean
  enableStructured: boolean
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

const defaultConfig: LoggerConfig = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  enableConsole: true,
  enableStructured: process.env.NODE_ENV === 'production'
}

let config: LoggerConfig = { ...defaultConfig }

export function configureLogger(newConfig: Partial<LoggerConfig>): void {
  config = { ...config, ...newConfig }
}

function createLogEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  error?: Error
): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context && { context })
  }

  if (error) {
    entry.error = {
      name: error.name,
      message: error.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
    }
  }

  return entry
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[config.level]
}

function output(entry: LogEntry): void {
  if (!config.enableConsole) return

  if (config.enableStructured) {
    const method = entry.level === 'debug' ? 'log' : entry.level
    console[method](JSON.stringify(entry))
  } else {
    const prefix = '[' + entry.timestamp + '] [' + entry.level.toUpperCase() + ']'
    const contextStr = entry.context ? ' ' + JSON.stringify(entry.context) : ''
    const errorStr = entry.error 
      ? '\n  Error: ' + entry.error.message + (entry.error.stack ? '\n  ' + entry.error.stack : '') 
      : ''
    
    const method = entry.level === 'debug' ? 'log' : entry.level
    console[method](prefix + ' ' + entry.message + contextStr + errorStr)
  }
}

export function debug(message: string, context?: Record<string, unknown>): void {
  if (!shouldLog('debug')) return
  output(createLogEntry('debug', message, context))
}

export function info(message: string, context?: Record<string, unknown>): void {
  if (!shouldLog('info')) return
  output(createLogEntry('info', message, context))
}

export function warn(message: string, context?: Record<string, unknown>, error?: Error): void {
  if (!shouldLog('warn')) return
  output(createLogEntry('warn', message, context, error))
}

export function error(message: string, context?: Record<string, unknown>, err?: Error): void {
  if (!shouldLog('error')) return
  output(createLogEntry('error', message, context, err))
}

export function logRequest(
  method: string,
  path: string,
  statusCode: number,
  durationMs: number,
  context?: Record<string, unknown>
): void {
  const level: LogLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info'
  if (!shouldLog(level)) return
  output(createLogEntry(level, method + ' ' + path + ' ' + statusCode + ' ' + durationMs + 'ms', context))
}

export function logAuth(
  event: 'login' | 'logout' | 'failed_login' | 'token_refresh',
  userId?: string,
  context?: Record<string, unknown>
): void {
  if (!shouldLog('info')) return
  output(createLogEntry('info', 'Auth: ' + event, { userId, ...context }))
}

export function logSecurity(event: string, context?: Record<string, unknown>): void {
  output(createLogEntry('warn', 'Security: ' + event, context))
}

export function logDatabase(
  operation: string,
  table: string,
  durationMs?: number,
  context?: Record<string, unknown>
): void {
  if (!shouldLog('debug')) return
  const msg = 'DB: ' + operation + ' ' + table + (durationMs ? ' ' + durationMs + 'ms' : '')
  output(createLogEntry('debug', msg, context))
}

export function createLogger(baseContext: Record<string, unknown>) {
  return {
    debug: (message: string, context?: Record<string, unknown>) =>
      debug(message, { ...baseContext, ...context }),
    info: (message: string, context?: Record<string, unknown>) =>
      info(message, { ...baseContext, ...context }),
    warn: (message: string, context?: Record<string, unknown>, err?: Error) =>
      warn(message, { ...baseContext, ...context }, err),
    error: (message: string, context?: Record<string, unknown>, err?: Error) =>
      error(message, { ...baseContext, ...context }, err)
  }
}

export const logger = {
  debug,
  info,
  warn,
  error,
  logRequest,
  logAuth,
  logSecurity,
  logDatabase,
  createLogger,
  configure: configureLogger
}
