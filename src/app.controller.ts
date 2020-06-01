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

@Controller()
export class AppController {
    imageKit = new ImageKit({
        publicKey: 'public_b0ympUG178eapBSFYBhgwywP2ao=',
        privateKey: 'private_xU9uIcjpbP6kFUjQLVai13KGfg8=',
        urlEndpoint: 'https://ik.imagekit.io/obschak',
    });

    constructor() {}

    @Post('upload')
    @HttpCode(200)
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(@UploadedFile() file) {
        try {
            const { filePath } = await this.imageKit.upload({
                file: file.buffer,
                fileName: file.originalname,
            });

            return { image: `https://ik.imagekit.io/obschak/tr:w-72,h-72${filePath}` };
        } catch (e) {
            return new BadRequestException(e);
        }
    }
}
