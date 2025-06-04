/**
 * Logger utility for consistent logging across the application
 * 
 * This module provides a simple logging interface with different log levels
 * and consistent formatting. It can be configured to output logs to different
 * destinations (console, file, external service) as needed.
 */

// Log levels
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

// Logger configuration
interface LoggerConfig {
  minLevel: LogLevel;
  includeTimestamp: boolean;
}

// Default configuration
const defaultConfig: LoggerConfig = {
  minLevel: LogLevel.INFO,
  includeTimestamp: true
};

// Current configuration
let config: LoggerConfig = { ...defaultConfig };

/**
 * Configure the logger
 * 
 * @param newConfig - Partial configuration to merge with current config
 */
export function configure(newConfig: Partial<LoggerConfig>): void {
  config = { ...config, ...newConfig };
}

/**
 * Format a log message
 * 
 * @param level - Log level
 * @param message - Log message
 * @param meta - Additional metadata
 * @returns Formatted log message
 */
function formatLog(level: LogLevel, message: string, meta?: any): string {
  const timestamp = config.includeTimestamp ? new Date().toISOString() : '';
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
}

/**
 * Log a message at the specified level
 * 
 * @param level - Log level
 * @param message - Log message
 * @param meta - Additional metadata
 */
function log(level: LogLevel, message: string, meta?: any): void {
  // Skip if log level is below minimum
  if (getLogLevelValue(level) < getLogLevelValue(config.minLevel)) {
    return;
  }
  
  const formattedMessage = formatLog(level, message, meta);
  
  switch (level) {
    case LogLevel.DEBUG:
      console.debug(formattedMessage);
      break;
    case LogLevel.INFO:
      console.info(formattedMessage);
      break;
    case LogLevel.WARN:
      console.warn(formattedMessage);
      break;
    case LogLevel.ERROR:
    case LogLevel.FATAL:
      console.error(formattedMessage);
      break;
  }
  
  // In a production environment, you might want to send logs to a service
  // like Sentry, LogRocket, or a custom backend endpoint
}

/**
 * Get numeric value for log level (for comparison)
 * 
 * @param level - Log level
 * @returns Numeric value
 */
function getLogLevelValue(level: LogLevel): number {
  switch (level) {
    case LogLevel.DEBUG: return 0;
    case LogLevel.INFO: return 1;
    case LogLevel.WARN: return 2;
    case LogLevel.ERROR: return 3;
    case LogLevel.FATAL: return 4;
    default: return -1;
  }
}

/**
 * Log a debug message
 * 
 * @param message - Log message
 * @param meta - Additional metadata
 */
export function debug(message: string, meta?: any): void {
  log(LogLevel.DEBUG, message, meta);
}

/**
 * Log an info message
 * 
 * @param message - Log message
 * @param meta - Additional metadata
 */
export function info(message: string, meta?: any): void {
  log(LogLevel.INFO, message, meta);
}

/**
 * Log a warning message
 * 
 * @param message - Log message
 * @param meta - Additional metadata
 */
export function warn(message: string, meta?: any): void {
  log(LogLevel.WARN, message, meta);
}

/**
 * Log an error message
 * 
 * @param message - Log message
 * @param error - Error object or additional metadata
 */
export function error(message: string, error?: Error | any): void {
  // If error is an Error object, extract useful information
  const meta = error instanceof Error
    ? { 
        message: error.message, 
        stack: error.stack,
        name: error.name
      }
    : error;
    
  log(LogLevel.ERROR, message, meta);
}

/**
 * Log a fatal error message
 * 
 * @param message - Log message
 * @param error - Error object or additional metadata
 */
export function fatal(message: string, error?: Error | any): void {
  // If error is an Error object, extract useful information
  const meta = error instanceof Error
    ? { 
        message: error.message, 
        stack: error.stack,
        name: error.name
      }
    : error;
    
  log(LogLevel.FATAL, message, meta);
}

// Export default object for convenience
export default {
  configure,
  debug,
  info,
  warn,
  error,
  fatal,
  LogLevel
};