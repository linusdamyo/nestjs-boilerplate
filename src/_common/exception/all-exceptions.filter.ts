import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { writeHttpLog } from '../logging/http-logging.interceptor';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost, private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const httpContext = host.switchToHttp();

    const response =
      exception instanceof HttpException
        ? (exception.getResponse() as { message: string; statusCode: HttpStatus })
        : {
            statusCode: HttpStatus.EXPECTATION_FAILED,
            message: exception instanceof Error ? exception.message : undefined,
            timestamp: Date.now(),
            path: httpAdapter.getRequestUrl(httpContext.getRequest()),
          };

    this.logger.error(JSON.stringify(exception, null, 2));

    writeHttpLog(httpContext, response);

    httpAdapter.reply(httpContext.getResponse(), response, response.statusCode);
  }
}
