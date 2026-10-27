import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { StickerPack } from '@entities/StickerPack';
import { Sticker } from '@entities/Sticker';
import { MinioService } from '../../minio/minio.service';
import { BUCKET_NAME } from '../../minio/minio.config';
import { CreateStickerPackDto } from './dto/create-sticker-pack.dto';
import { UpdateStickerPackDto } from './dto/update-sticker-pack.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AdminStickersService {
  constructor(
    @InjectRepository(StickerPack)
    private readonly packRepo: EntityRepository<StickerPack>,
    @InjectRepository(Sticker)
    private readonly stickerRepo: EntityRepository<Sticker>,
    private readonly minioService: MinioService,
    private readonly em: EntityManager,
  ) {}

  async createPack(
    data: CreateStickerPackDto,
    iconFile?: Express.Multer.File,
  ): Promise<StickerPack> {
    let iconUrl: string | null = null;

    if (iconFile) {
      const ext = iconFile.originalname.split('.').pop() || 'png';
      const fileName = `stickers/packs/${uuidv4()}.${ext}`;
      await this.minioService.uploadFile(
        BUCKET_NAME,
        fileName,
        iconFile.buffer,
        iconFile.mimetype,
      );
      iconUrl = fileName;
    }

    const pack = this.packRepo.create({
      name: data.name,
      description: data.description || null,
      icon_url: iconUrl,
      is_active: true,
      sort_order: 0,
    });

    await this.em.persistAndFlush(pack);

    if (pack.icon_url) {
      pack.icon_url = await this.minioService.getFileUrl(
        BUCKET_NAME,
        pack.icon_url,
      );
    }

    return pack;
  }

  async getPacks(): Promise<StickerPack[]> {
    const packs = await this.packRepo.find(
      {},
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

  async getPackById(id: string): Promise<StickerPack> {
    const pack = await this.packRepo.findOne(
      { id },
      {
        populate: ['stickers'],
      },
    );

    if (!pack) {
      throw new NotFoundException('Sticker pack not found');
    }

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

    return pack;
  }

  async updatePack(
    id: string,
    data: UpdateStickerPackDto,
    iconFile?: Express.Multer.File,
  ): Promise<StickerPack> {
    const pack = await this.packRepo.findOne({ id });
    if (!pack) {
      throw new NotFoundException('Sticker pack not found');
    }

    if (iconFile) {
      if (pack.icon_url) {
        await this.minioService.deleteFile(BUCKET_NAME, pack.icon_url);
      }
      const ext = iconFile.originalname.split('.').pop() || 'png';
      const fileName = `stickers/packs/${uuidv4()}.${ext}`;
      await this.minioService.uploadFile(
        BUCKET_NAME,
        fileName,
        iconFile.buffer,
        iconFile.mimetype,
      );
      pack.icon_url = fileName;
    }

    if (data.name !== undefined) {
      pack.name = data.name;
    }
    if (data.description !== undefined) {
      pack.description = data.description;
    }
    if (data.is_active !== undefined) {
      pack.is_active = data.is_active;
    }
    if (data.sort_order !== undefined) {
      pack.sort_order = data.sort_order;
    }

    await this.em.flush();

    if (pack.icon_url) {
      pack.icon_url = await this.minioService.getFileUrl(
        BUCKET_NAME,
        pack.icon_url,
      );
    }

    return pack;
  }

  async deletePack(id: string): Promise<void> {
    const pack = await this.packRepo.findOne({ id }, { populate: ['stickers'] });
    if (!pack) {
      throw new NotFoundException('Sticker pack not found');
    }

    if (pack.icon_url) {
      await this.minioService.deleteFile(BUCKET_NAME, pack.icon_url);
    }

    for (const stk of pack.stickers) {
      if (stk.image_url) {
        await this.minioService.deleteFile(BUCKET_NAME, stk.image_url);
      }
    }

    await this.em.removeAndFlush(pack);
  }

  async addStickersToPack(
    packId: string,
    files: Express.Multer.File[],
  ): Promise<Sticker[]> {
    const pack = await this.packRepo.findOne({ id: packId });
    if (!pack) {
      throw new NotFoundException('Sticker pack not found');
    }

    const createdStickers: Sticker[] = [];

    for (const file of files) {
      const ext = file.originalname.split('.').pop() || 'webp';
      const fileName = `stickers/items/${uuidv4()}.${ext}`;
      await this.minioService.uploadFile(
        BUCKET_NAME,
        fileName,
        file.buffer,
        file.mimetype,
      );

      const sticker = this.stickerRepo.create({
        pack,
        name: file.originalname.replace(`.${ext}`, ''),
        image_url: fileName,
        sort_order: 0,
      });

      createdStickers.push(sticker);
    }

    await this.em.persistAndFlush(createdStickers);

    await Promise.all(
      createdStickers.map(async (stk) => {
        stk.image_url = await this.minioService.getFileUrl(
          BUCKET_NAME,
          stk.image_url,
        );
      }),
    );

    return createdStickers;
  }

  async deleteSticker(id: string): Promise<void> {
    const sticker = await this.stickerRepo.findOne({ id });
    if (!sticker) {
      throw new NotFoundException('Sticker not found');
    }

    if (sticker.image_url) {
      await this.minioService.deleteFile(BUCKET_NAME, sticker.image_url);
    }

    await this.em.removeAndFlush(sticker);
  }
}
