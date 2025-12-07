import { INestApplication, Module } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({})
export class SwaggerAppModule {
  static setup(app: INestApplication) {
    const initialConfig = new DocumentBuilder()
      .setTitle('instagram-beta api')
      .setDescription('FPT console API documents')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, // Cấu hình Bearer Auth
        'JWT-auth',
      );

    const config = initialConfig.build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }
}
