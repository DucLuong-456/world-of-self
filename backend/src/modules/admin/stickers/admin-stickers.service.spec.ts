import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/core';
import { StickerPack } from '@entities/StickerPack';
import { Sticker } from '@entities/Sticker';
import { MinioService } from '../../minio/minio.service';
import { AdminStickersService } from './admin-stickers.service';

describe('AdminStickersService', () => {
  let service: AdminStickersService;

  const mockPackRepo = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockStickerRepo = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  const mockMinioService = {
    uploadFile: jest.fn(),
    getFileUrl: jest.fn(),
    deleteFile: jest.fn(),
  };

  const mockEm = {
    persistAndFlush: jest.fn(),
    flush: jest.fn(),
    removeAndFlush: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminStickersService,
        { provide: getRepositoryToken(StickerPack), useValue: mockPackRepo },
        { provide: getRepositoryToken(Sticker), useValue: mockStickerRepo },
        { provide: MinioService, useValue: mockMinioService },
        { provide: EntityManager, useValue: mockEm },
      ],
    }).compile();

    service = module.get<AdminStickersService>(AdminStickersService);
  });

  describe('createPack', () => {
    it('should create a sticker pack with an uploaded icon', async () => {
      const mockFile = {
        originalname: 'cat.png',
        buffer: Buffer.from('fake-image'),
        mimetype: 'image/png',
      } as Express.Multer.File;

      mockPackRepo.create.mockImplementation(
        (data: Record<string, unknown>) => ({
          id: 'pack-1',
          ...data,
        }),
      );
      mockMinioService.getFileUrl.mockResolvedValue(
        'http://localhost:9000/wos-bucket/stickers/packs/cat.png',
      );

      const result = await service.createPack(
        { name: 'Cat Pack', description: 'Cute cats' },
        mockFile,
      );

      expect(mockMinioService.uploadFile).toHaveBeenCalledTimes(1);
      expect(mockEm.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(result.name).toBe('Cat Pack');
      expect(result.icon_url).toBe(
        'http://localhost:9000/wos-bucket/stickers/packs/cat.png',
      );
    });
  });

  describe('updatePack', () => {
    it('should throw NotFoundException if pack does not exist', async () => {
      mockPackRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updatePack('non-existent', { is_active: false }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should toggle is_active and flush changes', async () => {
      const existingPack = {
        id: 'pack-1',
        name: 'Cat Pack',
        is_active: true,
        icon_url: null,
      };
      mockPackRepo.findOne.mockResolvedValue(existingPack);

      const result = await service.updatePack('pack-1', { is_active: false });

      expect(result.is_active).toBe(false);
      expect(mockEm.flush).toHaveBeenCalledTimes(1);
    });
  });

  describe('addStickersToPack', () => {
    it('should upload multiple sticker files and persist them', async () => {
      const existingPack = { id: 'pack-1', name: 'Cat Pack' };
      mockPackRepo.findOne.mockResolvedValue(existingPack);

      const files = [
        {
          originalname: 'happy.webp',
          buffer: Buffer.from('1'),
          mimetype: 'image/webp',
        },
        {
          originalname: 'sad.webp',
          buffer: Buffer.from('2'),
          mimetype: 'image/webp',
        },
      ] as Express.Multer.File[];

      mockStickerRepo.create.mockImplementation(
        (data: Record<string, unknown>) => ({
          id: 'stk-id',
          ...data,
        }),
      );
      mockMinioService.getFileUrl.mockImplementation(
        async (_bucket: string, key: string) =>
          `http://localhost:9000/wos-bucket/${key}`,
      );

      const result = await service.addStickersToPack('pack-1', files);

      expect(mockMinioService.uploadFile).toHaveBeenCalledTimes(2);
      expect(mockEm.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('happy');
      expect(result[1].name).toBe('sad');
    });
  });

  describe('deleteSticker', () => {
    it('should throw NotFoundException when sticker does not exist', async () => {
      mockStickerRepo.findOne.mockResolvedValue(null);

      await expect(service.deleteSticker('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should delete file from MinIO and remove entity from DB', async () => {
      const sticker = {
        id: 'stk-1',
        image_url: 'stickers/items/happy.webp',
      };
      mockStickerRepo.findOne.mockResolvedValue(sticker);

      await service.deleteSticker('stk-1');

      expect(mockMinioService.deleteFile).toHaveBeenCalledWith(
        expect.any(String),
        'stickers/items/happy.webp',
      );
      expect(mockEm.removeAndFlush).toHaveBeenCalledWith(sticker);
    });
  });
});
