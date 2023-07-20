import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { NoContentException } from '../no-content-exception';

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
      .pipe(map(data => {
        if (!data) throw new NotFoundException();

        if (data?.docs instanceof Array && !data?.docs.length) throw new NoContentException();

        if (data instanceof Array && !data.length) throw new NoContentException();

        if (data?.[0] instanceof Array && !data?.[0].length) throw new NoContentException();

        if (data?.length === 2 && typeof data[1] === 'number') return { data: data[0] };

        return { data };
      }));
  }
}
