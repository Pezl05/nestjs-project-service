import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class CustomLogger implements LoggerService {
  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    return `${timestamp} [${level.toUpperCase()}] [NestJS] - ${message}`;
  }

  log(message: string) {
    console.log(this.formatMessage('info', message));
  }

  error(message: string, trace?: string) {
    console.error(this.formatMessage('error', message));
    if (trace) console.error(trace);
  }

  warn(message: string) {
    console.warn(this.formatMessage('warn', message));
  }

  debug(message: string) {
    console.debug(this.formatMessage('debug', message));
  }

  verbose(message: string) {
    console.log(this.formatMessage('verbose', message));
  }
}
