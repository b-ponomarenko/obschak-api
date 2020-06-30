import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Event } from '../entities/Event';
import { Connection } from 'typeorm';

@Injectable()
export class MemberOfEventGuard implements CanActivate {
    constructor(private connection: Connection) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { params, headers } = context.switchToHttp().getRequest();
        const { eventId } = params;
        const { vk_user_id } = headers;
        const event = await this.connection.manager.findOne(Event, eventId);

        if (!event) {
            throw new NotFoundException(`События с id=${eventId} не существует`);
        }

        if (!event.users.includes(Number(vk_user_id))) {
            throw new ForbiddenException(`Вы не являетесь участником данного события`);
        }

        return true;
    }
}
