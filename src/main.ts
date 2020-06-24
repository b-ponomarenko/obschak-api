import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const fs = require('fs');

async function bootstrap() {
    const app = await NestFactory.create(AppModule, process.env.NODE_ENV === 'production' ? undefined : {
        httpsOptions: {
            key: fs.readFileSync(`${process.cwd()}/server.key`),
            cert: fs.readFileSync(`${process.cwd()}/server.crt`)
        }
    });
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe())
    await app.listen(process.env.PORT || 5000);
}
bootstrap();
