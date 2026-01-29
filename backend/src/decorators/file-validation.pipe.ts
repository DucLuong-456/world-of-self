import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

interface FileValidationOptions {
  maxSize: number;
  fileType: RegExp;
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly options: FileValidationOptions) {}

  transform(value: any) {
    if (!value) {
      return value;
    }

    Object.keys(value).forEach((key) => {
      const files = value[key];

      if (files && Array.isArray(files)) {
        files.forEach((file: Express.Multer.File) => {
          if (!file.mimetype.match(this.options.fileType)) {
            throw new BadRequestException(
              `File '${file.fieldname}' not correct format (image/*)`,
            );
          }

          if (file.size > this.options.maxSize) {
            const sizeInMB = this.options.maxSize / (1024 * 1024);
            throw new BadRequestException(
              `File '${file.fieldname}' exceeds the allowed size (${sizeInMB}MB)`,
            );
          }
        });
      }
    });

    return value;
  }
}
