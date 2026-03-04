import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // default status and message
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // show details of status and message when needed
    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const res = exception.getResponse();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      message =
        typeof res === 'string'
          ? res
          : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (res as any).message || exception.message;
    }

    // response format
    response.status(status).json({
      success: false,
      error: {
        statusCode: status,
        message,
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
