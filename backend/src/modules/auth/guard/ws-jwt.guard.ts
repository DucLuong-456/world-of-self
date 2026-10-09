import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Socket } from 'socket.io';
import { User } from '@entities/User';

import { EntityManager, RequestContext } from '@mikro-orm/core';

export interface AuthenticatedSocket extends Socket {
  user?: User;
  headers?: Record<string, string | undefined>;
}

@Injectable()
export class WsJwtGuard extends AuthGuard('jwt') {
  constructor(private readonly em: EntityManager) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<AuthenticatedSocket>();
    console.log(
      '[WsJwtGuard] canActivate called for client:',
      client?.id,
      'has user:',
      !!client?.user,
    );
    if (client?.user) {
      return true;
    }

    return RequestContext.create(this.em, async () => {
      try {
        const can = (await super.canActivate(context)) as boolean;
        console.log(
          '[WsJwtGuard] canActivate result:',
          can,
          'user:',
          client.user?.user_name,
        );
        return can;
      } catch (err) {
        console.error('[WsJwtGuard] canActivate error:', err);
        throw err;
      }
    });
  }

  getRequest(context: ExecutionContext) {
    const client = context.switchToWs().getClient<AuthenticatedSocket>();
    const handshake = client.handshake;

    // Attach headers to client so passport's jwt strategy can read from it and assign user directly to client.user
    client.headers = {
      authorization: handshake.auth?.token
        ? `Bearer ${handshake.auth.token}`
        : handshake.headers?.authorization,
      cookie: handshake.headers?.cookie,
    };

    return client;
  }
}
