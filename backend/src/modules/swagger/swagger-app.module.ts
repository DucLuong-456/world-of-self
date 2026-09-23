import { INestApplication, Module } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({})
export class SwaggerAppModule {
  static setup(app: INestApplication) {
    const initialConfig = new DocumentBuilder()
      .setTitle('World of Self for Study API')
      .setDescription('World of Self API documents')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT-auth',
      );

    const config = initialConfig.build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }
}
