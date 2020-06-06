import {
    ForbiddenException,
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { Connection, getManager } from 'typeorm';
import { EventUser } from '../entities/EventUser';
import { Event } from '../entities/Event';
import { Purchase } from '../entities/Purchase';
import { PurchaseUser } from '../entities/PurchaseUser';
import sortBy from '@tinkoff/utils/array/sortBy';
import isEmpty from '@tinkoff/utils/is/empty';
import { PurchasesService } from '../purchases/purchases.service';

/* Создать тестовую базу данных и для нее написать тесты */

@Injectable()
export class EventsService {
    private entityManager = getManager();

    constructor(
        private readonly connection: Connection,
        private readonly purchasesService: PurchasesService,
    ) {}

    public async createEvent(userId: number, body) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const { manager } = queryRunner;

        try {
            const users = [userId, ...body.users].map((userId) =>
                manager.create(EventUser, { userId }),
            );

            await Promise.all(users.map((user) => this.entityManager.save(user)));

            const event = await manager.save(Event, {
                ...body,
                creatorId: userId,
                users,
            });

            await queryRunner.commitTransaction();
            return { event: { ...event, users: event.users.map(({ userId }) => userId) } };
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

        try {
            const event = await manager.findOne(Event, eventId, {
                relations: ['users', 'purchases', 'purchases.participants'],
            });
            const { photo = null, users, title } = body;

            const newUsers = body.users.filter(
                (id) => !event.users.map(({ userId }) => userId).includes(id),
            );

            event.photo = photo;
            event.title = title;

            const eventUsers = await Promise.all<EventUser>(
                newUsers.map((userId) => manager.save(EventUser, { userId })),
            );

            event.users = [
                ...event.users.filter(({ userId }) => users.includes(userId)),
                ...eventUsers,
            ];
            event.purchases = await Promise.all<Purchase>(
                event.purchases
                    .filter(({ creatorId }) => users.includes(creatorId))
                    .map(async (purchase) => {
                        const purchaseUsers = await Promise.all<PurchaseUser>(
                            newUsers.map((userId) => manager.save(PurchaseUser, { userId, purchase })),
                        );

                        return {
                            ...purchase,
                            participants: [
                                ...purchase.participants.filter(({ userId }) => users.includes(userId)),
                                ...purchaseUsers,
                            ],
                        };
                    })
            );

            await Promise.all(event.purchases.map((purchase) => manager.save(Purchase, purchase)));
            await manager.save(event);
            await manager.delete(EventUser, { event: { id: null } });
            await manager.delete(PurchaseUser, { purchase: { id: null } });
            await queryRunner.commitTransaction();

            return event;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(e);
        } finally {
            await queryRunner.release();
        }
    }

    public deleteEvent() {}

    public async getOneEvent(eventId: number) {
        const event = await this.entityManager.findOne(
            Event,
            {
                id: eventId,
            },
            { relations: ['users', 'purchases', 'purchases.participants'] },
        );

        return {
            event: {
                ...event,
                users: event.users.map(({ userId }) => userId),
                purchases: sortBy(({ date }) => -date, event.purchases),
            },
        };
    }

    public async getEvents(userId: number) {
        const events = await this.entityManager
            .find(Event, {
                relations: ['users'],
            })
            .then((events) => events.filter((event) => this.isMemberOfEvent(event, userId)));

        return {
            events: events.map((event) => ({
                ...event,
                users: event.users.map(({ userId }) => userId),
            })),
        };
    }

    private isMemberOfEvent(event: Event, userId) {
        return event.users.map(({ userId }) => userId).includes(userId);
    }
}
