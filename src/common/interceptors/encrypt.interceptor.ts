import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { encryptResponse } from 'src/utils/aes.utils';

@Injectable()
export class EncryptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return encryptResponse(data); // Cifra la respuesta utilizando la función encryptResponse
      }),
    );
  }
}