import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { StickerPack } from '@entities/StickerPack';
import { Sticker } from '@entities/Sticker';
import { MinioService } from '../minio/minio.service';
import { BUCKET_NAME } from '../minio/minio.config';

@Injectable()
export class StickerService {
  constructor(
    @InjectRepository(StickerPack)
    private readonly packRepo: EntityRepository<StickerPack>,
    @InjectRepository(Sticker)
    private readonly stickerRepo: EntityRepository<Sticker>,
    private readonly minioService: MinioService,
  ) {}

  async getActivePacks(): Promise<StickerPack[]> {
    const packs = await this.packRepo.find(
      { is_active: true },
      {
        populate: ['stickers'],
        orderBy: { sort_order: 'ASC', created_at: 'DESC' },
      },
    );

    await Promise.all(
      packs.map(async (pack) => {
        if (pack.icon_url) {
          pack.icon_url = await this.minioService.getFileUrl(
            BUCKET_NAME,
            pack.icon_url,
          );
        }
        await Promise.all(
          pack.stickers.getItems().map(async (stk) => {
            if (stk.image_url) {
              stk.image_url = await this.minioService.getFileUrl(
                BUCKET_NAME,
                stk.image_url,
              );
            }
          }),
        );
      }),
    );

    return packs;
  }
}
