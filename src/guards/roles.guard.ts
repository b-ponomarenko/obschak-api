import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import filter from '@tinkoff/utils/object/filter';
import toPairs from '@tinkoff/utils/object/toPairs';
import fromPairs from '@tinkoff/utils/object/fromPairs';
import sortBy from '@tinkoff/utils/array/sortBy';
import compose from '@tinkoff/utils/function/compose';
import crypto from 'crypto';
import { stringify } from 'querystring';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private configService: ConfigService) {}

    canActivate(context: ExecutionContext): boolean {
        const vkSecretKey = this.configService.get('VK_SECRET_KEY');
        const { headers } = context.switchToHttp().getRequest();
        const { sign } = headers;
        const vkHeaders = compose<
            Record<string, string>,
            Record<string, string>,
            Array<[string, string]>,
            Array<[string, string]>,
            Record<string, string>
        >(
            fromPairs,
            sortBy(([key]) => key),
            toPairs,
            filter((_, key: string) => key.slice(0, 3) === 'vk_'),
        )(headers);
        const builtSign = crypto
            .createHmac('sha256', vkSecretKey)
            .update(stringify(vkHeaders))
            .digest()
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=$/, '');

        return sign === builtSign;
    }
}
