import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VideosService {
  streamVideo(id: string, req: Request, res: Response) {
    const videoPath = path.join(
      process.cwd(),
      'assets',
      'uploads',
      `${id}.mp4`,
    );
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
      res.status(416).send('Requires Range header');
      return;
    }

    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + 1e6, fileSize - 1);
    const contentLength = end - start + 1;

    const headers = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, headers);
    fs.createReadStream(videoPath, { start, end }).pipe(res);
  }
}
