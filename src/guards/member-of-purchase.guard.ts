import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Purchase } from '../entities/Purchase';

@Injectable()
export class MemberOfPurchaseGuard implements CanActivate {
    constructor(private connection: Connection) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { params, headers } = context.switchToHttp().getRequest();
        const { purchaseId } = params;
        const { vk_user_id } = headers;
        const purchase = await this.connection.manager.findOne(Purchase, purchaseId, {
            relations: ['event'],
        });

        if (!purchase) {
            throw new NotFoundException(`Покупки с id=${purchaseId} не существует`);
        }

        if (!purchase.event.users.includes(Number(vk_user_id))) {
            throw new ForbiddenException(`Вы не являетесь участником данного события`);
        }

        return true;
    }
}
