import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { StickerPack } from '@entities/StickerPack';
import { Sticker } from '@entities/Sticker';
import { MinioService } from '../minio/minio.service';
import { StickerService } from './sticker.service';

describe('StickerService', () => {
  let service: StickerService;

  const mockPackRepo = {
    find: jest.fn(),
  };

  const mockStickerRepo = {
    find: jest.fn(),
  };

  const mockMinioService = {
    getFileUrl: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StickerService,
        { provide: getRepositoryToken(StickerPack), useValue: mockPackRepo },
        { provide: getRepositoryToken(Sticker), useValue: mockStickerRepo },
        { provide: MinioService, useValue: mockMinioService },
      ],
    }).compile();

    service = module.get<StickerService>(StickerService);
  });

  it('should return active sticker packs with resolved MinIO URLs', async () => {
    const mockStickerItem = {
      id: 'stk-1',
      name: 'wave',
      image_url: 'stickers/items/wave.webp',
    };
    const mockPack = {
      id: 'pack-1',
      name: 'Meo Cute',
      icon_url: 'stickers/packs/icon.png',
      is_active: true,
      stickers: {
        getItems: () => [mockStickerItem],
      },
    };

    mockPackRepo.find.mockResolvedValue([mockPack]);
    mockMinioService.getFileUrl.mockImplementation(
      async (_bucket: string, key: string) =>
        `http://localhost:9000/wos-bucket/${key}`,
    );

    const result = await service.getActivePacks();

    expect(mockPackRepo.find).toHaveBeenCalledWith(
      { is_active: true },
      {
        populate: ['stickers'],
        orderBy: { sort_order: 'ASC', created_at: 'DESC' },
      },
    );
    expect(result).toHaveLength(1);
    expect(result[0].icon_url).toBe(
      'http://localhost:9000/wos-bucket/stickers/packs/icon.png',
    );
    expect(mockStickerItem.image_url).toBe(
      'http://localhost:9000/wos-bucket/stickers/items/wave.webp',
    );
  });
});
