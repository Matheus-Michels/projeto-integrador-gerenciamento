import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    return new Promise<boolean>((resolve, reject) => {
      verifySession()(req, res, (err: any) => {
        if (err) {
          reject(new UnauthorizedException('Sessão inválida ou ausente. Faça login para continuar.'));
        } else {
          resolve(true);
        }
      });
    });
  }
}