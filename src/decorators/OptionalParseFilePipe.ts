import { Injectable } from '@nestjs/common';
import { ParseFilePipe } from '@nestjs/common/pipes';

@Injectable()
export class OptionalParseFilePipe extends ParseFilePipe {
  transform(value: any): Promise<any> {
    if (!value) {
      return null;
    }

    return super.transform(value);
  }
}
