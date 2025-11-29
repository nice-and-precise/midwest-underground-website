import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  debug,
  info,
  warn,
  error,
  logRequest,
  logAuth,
  logSecurity,
  logDatabase,
  createLogger,
  configureLogger,
  logger
} from '@/lib/logger'

describe('Logger', () => {
  const consoleMocks = {
    log: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(consoleMocks.log)
    vi.spyOn(console, 'info').mockImplementation(consoleMocks.info)
    vi.spyOn(console, 'warn').mockImplementation(consoleMocks.warn)
    vi.spyOn(console, 'error').mockImplementation(consoleMocks.error)

    // Reset to default config
    configureLogger({
      level: 'debug',
      enableConsole: true,
      enableStructured: false
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    consoleMocks.log.mockClear()
    consoleMocks.info.mockClear()
    consoleMocks.warn.mockClear()
    consoleMocks.error.mockClear()
  })

  describe('configureLogger', () => {
    it('should update logger configuration', () => {
      configureLogger({ level: 'warn' })
      debug('test message')
      expect(consoleMocks.log).not.toHaveBeenCalled()
    })

    it('should allow partial config updates', () => {
      configureLogger({ enableStructured: true })
      info('test message')
      expect(consoleMocks.info).toHaveBeenCalled()
      const output = consoleMocks.info.mock.calls[0][0]
      expect(() => JSON.parse(output)).not.toThrow()
    })

    it('should disable console output when enableConsole is false', () => {
      configureLogger({ enableConsole: false })
      info('test message')
      expect(consoleMocks.info).not.toHaveBeenCalled()
    })
  })

  describe('debug', () => {
    it('should log debug messages', () => {
      debug('debug message')
      expect(consoleMocks.log).toHaveBeenCalled()
      expect(consoleMocks.log.mock.calls[0][0]).toContain('[DEBUG]')
      expect(consoleMocks.log.mock.calls[0][0]).toContain('debug message')
    })

    it('should include context in debug messages', () => {
      debug('debug message', { userId: '123' })
      expect(consoleMocks.log.mock.calls[0][0]).toContain('userId')
      expect(consoleMocks.log.mock.calls[0][0]).toContain('123')
    })

    it('should not log when level is above debug', () => {
      configureLogger({ level: 'info' })
      debug('debug message')
      expect(consoleMocks.log).not.toHaveBeenCalled()
    })
  })

  describe('info', () => {
    it('should log info messages', () => {
      info('info message')
      expect(consoleMocks.info).toHaveBeenCalled()
      expect(consoleMocks.info.mock.calls[0][0]).toContain('[INFO]')
      expect(consoleMocks.info.mock.calls[0][0]).toContain('info message')
    })

    it('should include context in info messages', () => {
      info('info message', { action: 'create' })
      expect(consoleMocks.info.mock.calls[0][0]).toContain('action')
      expect(consoleMocks.info.mock.calls[0][0]).toContain('create')
    })

    it('should not log when level is above info', () => {
      configureLogger({ level: 'warn' })
      info('info message')
      expect(consoleMocks.info).not.toHaveBeenCalled()
    })
  })

  describe('warn', () => {
    it('should log warning messages', () => {
      warn('warning message')
      expect(consoleMocks.warn).toHaveBeenCalled()
      expect(consoleMocks.warn.mock.calls[0][0]).toContain('[WARN]')
      expect(consoleMocks.warn.mock.calls[0][0]).toContain('warning message')
    })

    it('should include error details in warning messages', () => {
      const testError = new Error('test error')
      warn('warning message', { context: 'test' }, testError)
      expect(consoleMocks.warn.mock.calls[0][0]).toContain('test error')
    })

    it('should not log when level is above warn', () => {
      configureLogger({ level: 'error' })
      warn('warning message')
      expect(consoleMocks.warn).not.toHaveBeenCalled()
    })
  })

  describe('error', () => {
    it('should log error messages', () => {
      error('error message')
      expect(consoleMocks.error).toHaveBeenCalled()
      expect(consoleMocks.error.mock.calls[0][0]).toContain('[ERROR]')
      expect(consoleMocks.error.mock.calls[0][0]).toContain('error message')
    })

    it('should include error object details', () => {
      const testError = new Error('detailed error')
      error('error message', { context: 'test' }, testError)
      expect(consoleMocks.error.mock.calls[0][0]).toContain('detailed error')
    })

    it('should always log at error level', () => {
      configureLogger({ level: 'error' })
      error('error message')
      expect(consoleMocks.error).toHaveBeenCalled()
    })
  })

  describe('logRequest', () => {
    it('should log successful requests as info', () => {
      logRequest('GET', '/api/users', 200, 45)
      expect(consoleMocks.info).toHaveBeenCalled()
      expect(consoleMocks.info.mock.calls[0][0]).toContain('GET')
      expect(consoleMocks.info.mock.calls[0][0]).toContain('/api/users')
      expect(consoleMocks.info.mock.calls[0][0]).toContain('200')
      expect(consoleMocks.info.mock.calls[0][0]).toContain('45ms')
    })

    it('should log 4xx requests as warn', () => {
      logRequest('POST', '/api/login', 401, 30)
      expect(consoleMocks.warn).toHaveBeenCalled()
      expect(consoleMocks.warn.mock.calls[0][0]).toContain('401')
    })

    it('should log 5xx requests as error', () => {
      logRequest('GET', '/api/data', 500, 100)
      expect(consoleMocks.error).toHaveBeenCalled()
      expect(consoleMocks.error.mock.calls[0][0]).toContain('500')
    })

    it('should include additional context', () => {
      logRequest('GET', '/api/users', 200, 45, { userId: '123' })
      expect(consoleMocks.info.mock.calls[0][0]).toContain('userId')
    })
  })

  describe('logAuth', () => {
    it('should log login events', () => {
      logAuth('login', 'user-123')
      expect(consoleMocks.info).toHaveBeenCalled()
      expect(consoleMocks.info.mock.calls[0][0]).toContain('Auth: login')
    })

    it('should log logout events', () => {
      logAuth('logout', 'user-123')
      expect(consoleMocks.info.mock.calls[0][0]).toContain('Auth: logout')
    })

    it('should log failed login events', () => {
      logAuth('failed_login', undefined, { ip: '192.168.1.1' })
      expect(consoleMocks.info.mock.calls[0][0]).toContain('Auth: failed_login')
    })

    it('should log token refresh events', () => {
      logAuth('token_refresh', 'user-123')
      expect(consoleMocks.info.mock.calls[0][0]).toContain('Auth: token_refresh')
    })
  })

  describe('logSecurity', () => {
    it('should log security events as warnings', () => {
      logSecurity('Rate limit exceeded')
      expect(consoleMocks.warn).toHaveBeenCalled()
      expect(consoleMocks.warn.mock.calls[0][0]).toContain('Security: Rate limit exceeded')
    })

    it('should include context in security logs', () => {
      logSecurity('Suspicious activity', { ip: '10.0.0.1', attempts: 10 })
      expect(consoleMocks.warn.mock.calls[0][0]).toContain('10.0.0.1')
    })
  })

  describe('logDatabase', () => {
    it('should log database operations', () => {
      logDatabase('SELECT', 'users', 15)
      expect(consoleMocks.log).toHaveBeenCalled()
      expect(consoleMocks.log.mock.calls[0][0]).toContain('DB: SELECT users 15ms')
    })

    it('should log without duration', () => {
      logDatabase('INSERT', 'projects')
      expect(consoleMocks.log.mock.calls[0][0]).toContain('DB: INSERT projects')
      expect(consoleMocks.log.mock.calls[0][0]).not.toContain('ms')
    })

    it('should include context', () => {
      logDatabase('UPDATE', 'users', 20, { rowsAffected: 5 })
      expect(consoleMocks.log.mock.calls[0][0]).toContain('rowsAffected')
    })

    it('should respect log level', () => {
      configureLogger({ level: 'info' })
      logDatabase('SELECT', 'users', 15)
      expect(consoleMocks.log).not.toHaveBeenCalled()
    })
  })

  describe('createLogger', () => {
    it('should create a child logger with base context', () => {
      const childLogger = createLogger({ service: 'api', version: '1.0' })
      childLogger.info('test message')
      expect(consoleMocks.info.mock.calls[0][0]).toContain('service')
      expect(consoleMocks.info.mock.calls[0][0]).toContain('api')
    })

    it('should merge base and call context', () => {
      const childLogger = createLogger({ service: 'api' })
      childLogger.info('test message', { userId: '123' })
      expect(consoleMocks.info.mock.calls[0][0]).toContain('service')
      expect(consoleMocks.info.mock.calls[0][0]).toContain('userId')
    })

    it('should support all log methods', () => {
      const childLogger = createLogger({ service: 'test' })

      childLogger.debug('debug')
      expect(consoleMocks.log).toHaveBeenCalled()

      childLogger.info('info')
      expect(consoleMocks.info).toHaveBeenCalled()

      childLogger.warn('warn')
      expect(consoleMocks.warn).toHaveBeenCalled()

      childLogger.error('error')
      expect(consoleMocks.error).toHaveBeenCalled()
    })

    it('should pass errors to warn and error methods', () => {
      const childLogger = createLogger({ service: 'test' })
      const testError = new Error('child error')

      childLogger.warn('warning', {}, testError)
      expect(consoleMocks.warn.mock.calls[0][0]).toContain('child error')

      childLogger.error('error', {}, testError)
      expect(consoleMocks.error.mock.calls[0][0]).toContain('child error')
    })
  })

  describe('structured output', () => {
    beforeEach(() => {
      configureLogger({ enableStructured: true })
    })

    it('should output valid JSON', () => {
      info('test message', { key: 'value' })
      const output = consoleMocks.info.mock.calls[0][0]
      expect(() => JSON.parse(output)).not.toThrow()
    })

    it('should include all log entry fields', () => {
      info('test message', { key: 'value' })
      const output = JSON.parse(consoleMocks.info.mock.calls[0][0])
      expect(output).toHaveProperty('timestamp')
      expect(output).toHaveProperty('level', 'info')
      expect(output).toHaveProperty('message', 'test message')
      expect(output).toHaveProperty('context')
      expect(output.context.key).toBe('value')
    })

    it('should use console.log for debug level in structured mode', () => {
      debug('debug message')
      expect(consoleMocks.log).toHaveBeenCalled()
    })
  })

  describe('logger namespace export', () => {
    it('should export all methods', () => {
      expect(logger.debug).toBe(debug)
      expect(logger.info).toBe(info)
      expect(logger.warn).toBe(warn)
      expect(logger.error).toBe(error)
      expect(logger.logRequest).toBe(logRequest)
      expect(logger.logAuth).toBe(logAuth)
      expect(logger.logSecurity).toBe(logSecurity)
      expect(logger.logDatabase).toBe(logDatabase)
      expect(logger.createLogger).toBe(createLogger)
      expect(logger.configure).toBe(configureLogger)
    })
  })
})
