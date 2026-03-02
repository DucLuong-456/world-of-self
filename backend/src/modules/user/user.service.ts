import { User } from '@entities/User';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BUCKET_NAME } from '@modules/minio/minio.config';
import { MinioService } from '@modules/minio/minio.service';
import { v4 as uuidv4 } from 'uuid';

import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private em: EntityManager,
    @Inject(REQUEST) protected request: Request,
    private readonly minioService: MinioService,
  ) {}

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    return user;
  }

  async getMe() {
    const user = this.request.user as User;

    if (user.avatar) {
      user.avatar = await this.minioService.getFileUrl(
        BUCKET_NAME,
        user.avatar,
      );
    }

    if (user.profile?.cover_avatar) {
      user.profile.cover_avatar = await this.minioService.getFileUrl(
        BUCKET_NAME,
        user.profile.cover_avatar,
      );
    }

    return user;
  }

  async updateUserProfile(userId: string, data: UpdateUserDto) {
    await this.em.begin();
    try {
      const user = await this.userRepository.findOneOrFail(
        { id: userId },
        {
          fields: ['id', 'user_name', 'email', 'phone', 'avatar'],
          populate: ['profile'],
        },
      );

      if (data.user_name) {
        user.user_name = data.user_name;
      }
      if (data.email) {
        user.email = data.email;
      }
      if (data.phone) {
        user.phone = data.phone;
      }
      if (data.avatar) {
        if (user.avatar) {
          await this.minioService.deleteFile(BUCKET_NAME, user.avatar);
        }
        const extension = data.avatar.originalname.split('.').pop();
        const fileName = `avatars/${uuidv4()}.${extension}`;
        await this.minioService.uploadFile(
          BUCKET_NAME,
          fileName,
          data.avatar.buffer,
          data.avatar.mimetype,
        );
        user.avatar = fileName;
      }

      if (data.bio) {
        user.profile.bio = data.bio;
      }
      if (data.location) {
        user.profile.location = data.location;
      }
      if (data.profession) {
        user.profile.profession = data.profession;
      }
      if (data.company) {
        user.profile.company = data.company;
      }
      if (data.education) {
        user.profile.education = data.education;
      }
      if (data.cover_avatar) {
        if (user.profile.cover_avatar) {
          await this.minioService.deleteFile(
            BUCKET_NAME,
            user.profile.cover_avatar,
          );
        }
        const extension = data.cover_avatar.originalname.split('.').pop();
        const fileName = `covers/${uuidv4()}.${extension}`;
        await this.minioService.uploadFile(
          BUCKET_NAME,
          fileName,
          data.cover_avatar.buffer,
          data.cover_avatar.mimetype,
        );
        user.profile.cover_avatar = fileName;
      }
      this.em.persist(user);

      await this.em.flush();
      await this.em.commit();

      if (user.avatar) {
        user.avatar = await this.minioService.getFileUrl(
          BUCKET_NAME,
          user.avatar,
        );
      }

      if (user.profile.cover_avatar) {
        user.profile.cover_avatar = await this.minioService.getFileUrl(
          BUCKET_NAME,
          user.profile.cover_avatar,
        );
      }

      return user;
    } catch (error) {
      console.log('error', error);
      await this.em.rollback();
      throw error;
    }
  }
}
