import { EntityManager } from '@mikro-orm/postgresql';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';

@Injectable()
export class ForcePrimaryInterceptor implements NestInterceptor {
  constructor(private readonly em: EntityManager) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Wrap the entire request pipeline in a transactional block.
    // MikroORM automatically routes all queries inside a transaction to the write (Primary) connection.
    return from(
      this.em.transactional(async () => {
        // Since next.handle() returns an Observable, we use lastValueFrom to await its completion
        // inside the transaction block.
        const { lastValueFrom } = await import('rxjs');
        return lastValueFrom(next.handle());
      }),
    );
  }
}
