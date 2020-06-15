import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Event } from '../entities/Event';
import sortBy from '@tinkoff/utils/array/sortBy';
import { Purchase } from '../entities/Purchase';
import { Transfer } from '../entities/Transfer';

@Injectable()
export class EventsService {
    constructor(private readonly connection: Connection) {}

    public async createEvent(userId: number, body) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const { manager } = queryRunner;

        try {
            const event = await manager.save(Event, {
                ...body,
                creatorId: userId,
                users: [userId, ...body.users],
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

        try {
            const event = await manager.findOne(Event, eventId, {
                relations: ['purchases', 'transfers'],
            });
            const { photo = null, users, title } = body;

            const newUsers = body.users.filter((id) => !event.users.includes(id));

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
                ({ from, to }) => body.users.includes(from) && body.users.includes(to),
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
}
