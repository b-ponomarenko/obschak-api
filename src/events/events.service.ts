import {
    BadRequestException,
    ForbiddenException,
    HttpException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { Connection } from 'typeorm';
import { Event } from '../entities/Event';
import sortBy from '@tinkoff/utils/array/sortBy';
import { Purchase } from '../entities/Purchase';
import { Transfer } from '../entities/Transfer';
import isEmpty from '@tinkoff/utils/is/empty';
import { VkService } from '../vk/vk.service';

@Injectable()
export class EventsService {
    constructor(private readonly connection: Connection, private readonly vkService: VkService) {}

    public async createEvent(userId: number, body) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const { manager } = queryRunner;

        const users = await this.filterUsers(body.users);

        try {
            const event = await manager.save(Event, {
                ...body,
                creatorId: userId,
                users: [userId, ...users],
                purchases: [],
            });

            await queryRunner.commitTransaction();

            return event;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(e);
        } finally {
            await queryRunner.release();
        }
    }

    public async updateEvent(body, userId, eventId) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const { manager } = queryRunner;

        const event = await manager.findOne(Event, eventId, {
            relations: ['purchases', 'transfers'],
        });
        const { photo = null, title } = body;

        const users = await this.filterUsers(body.users);

        const newUsers = users.filter((id) => !event.users.includes(id));
        const deletableUsers = users.filter((id) => !users.includes(id));
        const leaveEvent = deletableUsers.length === 1 && deletableUsers[0] === userId;

        // TODO для кейса с выходом из события сделать отдельный метод
        if (!isEmpty(deletableUsers) && userId !== event.creatorId && !leaveEvent) {
            throw new ForbiddenException(
                `Только создатель события события может выполнить данный запрос`,
            );
        }

        try {
            event.photo = photo;
            event.title = title;

            event.users = users;
            event.purchases = event.purchases
                .filter(({ creatorId }) => users.includes(creatorId))
                .map((purchase) => ({
                    ...purchase,
                    participants: [
                        ...purchase.participants.filter((userId) => users.includes(userId)),
                        ...newUsers,
                    ],
                }));
            event.transfers = event.transfers.filter(
                ({ from, to }) => users.includes(from) && users.includes(to),
            );

            await Promise.all(event.purchases.map((purchase) => manager.save(Purchase, purchase)));
            await Promise.all(event.transfers.map((transfer) => manager.save(Transfer, transfer)));
            await manager.save(event);

            await queryRunner.commitTransaction();

            return event;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(e);
        } finally {
            await queryRunner.release();
        }
    }

    public async deleteEvent(eventId) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const { manager } = queryRunner;

        try {
            await manager.delete(Event, eventId);

            await queryRunner.commitTransaction();

            return;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(e);
        } finally {
            await queryRunner.release();
        }
    }

    public async getOneEvent(eventId: number) {
        const event = await this.connection.manager.findOne(Event, eventId, {
            relations: ['purchases', 'transfers'],
        });

        return {
            ...event,
            purchases: sortBy(({ date }) => -date, event.purchases),
        };
    }

    public async getEvents(userId: number) {
        return this.connection.manager.find(Event).then((events) => {
            return events.filter((event) => event.users.includes(userId));
        });
    }

    public async getEventsDeep() {
        return this.connection.manager.find(Event, { relations: ['purchases', 'transfers'] });
    }

    private async filterUsers(userIds: number[]) {
        return (
            this.vkService.vk.api.users
                // @ts-ignore
                .get({ user_ids: userIds, fields: ['deactivated'] })
                .then((users) =>
                    users.filter(({ deactivated }) => !deactivated).map(({ id }) => id),
                )
        );
    }
}
