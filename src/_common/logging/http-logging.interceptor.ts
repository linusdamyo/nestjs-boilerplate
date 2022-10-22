import { NestInterceptor, Injectable, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { tap } from 'rxjs';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const httpContext = context.switchToHttp();

    return next.handle().pipe(tap(data => writeHttpLog(httpContext, { statusCode: httpContext.getResponse()?.statusCode, data })));
  }
}

export const writeHttpLog = (httpContext, response) => {
  const logger = new Logger('HttpLoggingInterceptor');

  const { method, originalUrl, query, params, body } = httpContext.getRequest();

  logger.log(JSON.stringify({ request: { method, originalUrl, query, params, body }, response }, null, 2));
};
