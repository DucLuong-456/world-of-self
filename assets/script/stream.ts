import { Transform } from 'stream';
import * as fs from 'fs';

const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    const upperChunk = chunk.toString().toUpperCase();
    this.push(upperChunk);
    callback();
  },
});

const readStream = fs
  .createReadStream('input.txt')
  .pipe(upperCaseTransform)
  .pipe(fs.createWriteStream('output-uppercase.txt'));

readStream.on('finish', () => {
  console.log(
    'Stream processing completed. Output written to output-uppercase.txt',
  );
});

// Giải thích:

// Transform stream giúp chỉnh sửa/chuyển đổi nội dung khi stream chạy qua.

// Trong ví dụ: tất cả dữ liệu trong input.txt sẽ được chuyển sang chữ in hoa và ghi ra file mới.
