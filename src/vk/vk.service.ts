import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import VK from 'vk-io';

@Injectable()
export class VkService {
    vk: VK;

    constructor(private configService: ConfigService) {
        this.vk = new VK({
            token: configService.get('VK_TOKEN'),
        });
    }
}
