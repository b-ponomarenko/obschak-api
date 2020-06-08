import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Event } from './entities/Event';
import { Connection } from 'typeorm';

@Injectable()
export class CreatorOfEventGuard implements CanActivate {
  constructor(private connection: Connection) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const { params, headers } = context.switchToHttp().getRequest();
    const { eventId } = params;
    const { vk_user_id } = headers;
    const event = await this.connection.manager.findOne(Event, eventId);

    if (!event) {
      return false;
    }

    return Number(vk_user_id) === event.creatorId;
  }
}
