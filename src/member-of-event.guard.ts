import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Event } from './entities/Event';
import { getManager } from 'typeorm';

@Injectable()
export class MemberOfEventGuard implements CanActivate {
  entityManager = getManager();

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const { params, headers } = context.switchToHttp().getRequest();
    const { eventId } = params;
    const { vk_user_id } = headers;
    const event = await this.entityManager.findOne(Event, eventId, { relations: ['users'] });

    if (!event) {
      return false;
    }

    return event.users.map(({ userId }) => userId).includes(Number(vk_user_id));
  }
}
