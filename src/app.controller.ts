import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    HttpCode,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import ImageKit from 'imagekit';
import { ConfigService } from '@nestjs/config';
import { RateLimit } from 'nestjs-rate-limiter';

@Controller()
export class AppController {
    imageKit = new ImageKit({
        publicKey: this.configService.get('IMAGEKIT_PUBLIC_KEY'),
        privateKey: this.configService.get('IMAGEKIT_PRIVATE_KEY'),
        urlEndpoint: this.configService.get('IMAGEKIT_URL'),
    });

    constructor(private configService: ConfigService) {}

    @RateLimit({ points: 5, duration: 10 })
    @Post('upload')
    @HttpCode(200)
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(@UploadedFile() file) {
        try {
            const { filePath } = await this.imageKit.upload({
                file: file.buffer,
                fileName: file.originalname,
            });

            return { image: filePath };
        } catch (e) {
            return new BadRequestException(e);
        }
    }
}
