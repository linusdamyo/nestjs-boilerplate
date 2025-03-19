import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: Logger) {}

    intercept<T>(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
        const request = context.switchToHttp().getRequest<Request>();
        const { method, url, body } = request;

        return next.handle().pipe(
            tap({
                next: (responseBody: T) => {
                    this.logger.log({
                        msg: 'response sent',
                        method,
                        url,
                        body,
                        responseBody,
                    });
                },
                error: (error: Error) => {
                    if (error instanceof HttpException) {
                        this.logger.warn({
                            msg: 'error occurred',
                            method,
                            url,
                            body,
                            error,
                        });
                    } else {
                        this.logger.error({
                            msg: 'error occurred',
                            method,
                            url,
                            body,
                            error: error.message,
                        });
                    }
                },
            }),
        );
    }
}
