import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

export class BaseResponse<T> {
  constructor(data: T) {
    this.data = data;
  }
  data: T;
}

export class PagingResponse<T> {
  constructor(
    data: T,
    paging: {
      limit: number;
      page: number;
      totalCount: number;
    },
  ) {
    this.data = data;
    this.paging = paging;
  }
  data: T;
  paging: {
    limit: number;
    page: number;
    totalCount: number;
  };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof PagingResponse) {
          return {
            data: data.data,
            paging: data.paging,
          };
        } else {
          return data;
        }
      }),
    );
  }
}
