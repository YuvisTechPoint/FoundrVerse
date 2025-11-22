/**
 * Production-ready logging utility
 * Replaces console.log/error/warn with structured logging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    // In production, only log errors and warnings
    if (this.isProduction && (level === 'debug' || level === 'info')) {
      return;
    }

    const formatted = this.formatMessage(level, message, context);

    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formatted);
        }
        break;
      case 'info':
        console.info(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
        console.error(formatted);
        // In production, you might want to send to error tracking service
        // e.g., Sentry, LogRocket, etc.
        break;
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = {
      ...context,
      ...(error instanceof Error
        ? {
            errorMessage: error.message,
            errorStack: this.isDevelopment ? error.stack : undefined,
            errorName: error.name,
          }
        : { error: String(error) }),
    };
    this.log('error', message, errorContext);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export type for use in other files
export type { LogContext };

