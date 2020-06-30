import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Transfer } from '../entities/Transfer';

@Injectable()
export class MemberOfTransferGuard implements CanActivate {
    constructor(private connection: Connection) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { params, headers } = context.switchToHttp().getRequest();
        const { transferId } = params;
        const { vk_user_id } = headers;
        const transfer = await this.connection.manager.findOne(Transfer, transferId, {
            relations: ['event'],
        });

        if (!transfer) {
            throw new NotFoundException(`Перевода с id=${transferId} не существует`);
        }

        if (!transfer.event.users.includes(Number(vk_user_id))) {
            throw new ForbiddenException(`Вы не являетесь участником данного события`);
        }

        return true;
    }
}
