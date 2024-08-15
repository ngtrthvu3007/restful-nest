import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;
    return next.handle().pipe(
      map((data) => ({
        statusCode,
        message: statusCode >= 400 ? 'Error' : 'Success',
        error: statusCode >= 400 ? response.message : null,
        path: request.url,
        method: request.method,
        data,
      })),
      catchError((err) => {
        const { response } = err;
        const statusCode = response instanceof HttpException ? err.getStatus() : 500;
        const errorResponse = {
          statusCode,
          message: response.message || 'Internal server error',
          error: response.error || 'Error',
          path: request.url,
          method: request.method,
          data: {},
        };
        return throwError(() => new HttpException(errorResponse, statusCode));
      }),
    );
  }
}
