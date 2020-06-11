import { createParamDecorator } from '@nestjs/common';

export const VkUserId = createParamDecorator((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return Number(request.headers['vk_user_id']);
});
