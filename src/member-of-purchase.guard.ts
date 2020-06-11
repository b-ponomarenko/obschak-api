import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Purchase } from './entities/Purchase';

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
            return false;
        }

        return purchase.event.users.includes(Number(vk_user_id));
    }
}
