import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: (requestOrigin = '', cb) => {
            if (requestOrigin.includes('vk-apps.com')) {
                return cb(null, true);
            }

            return cb(null, false);
        },
    });
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(process.env.PORT || 5000);
}
bootstrap();
