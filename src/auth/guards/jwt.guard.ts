import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {

  constructor( private readonly reflector: Reflector ) { super(); }

  canActivate(context: ExecutionContext){
    const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass(),]);
    return (isPublic) ? true : super.canActivate(context);
  }
}
