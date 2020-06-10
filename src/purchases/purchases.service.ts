import { Injectable, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { PurchaseUser } from '../entities/PurchaseUser';
import { Purchase } from '../entities/Purchase';
import { Connection } from 'typeorm';
import { EventsService } from '../events/events.service';
import omit from '@tinkoff/utils/object/omit';

@Injectable()
export class PurchasesService {
    constructor(
        private readonly eventsService: EventsService,
        private readonly connection: Connection,
    ) {}

    public async createPurchase(body, eventId: number) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const { manager } = queryRunner;

        try {
            const { name, value, currency, creatorId } = body;
            const { event } = await this.eventsService.getOneEvent(eventId);

            if (
                !body.participants.every((userId) => event.users.includes(userId)) ||
                !event.users.includes(creatorId)
            ) {
                throw new ForbiddenException();
            }

            const participants = body.participants.map((userId) =>
                manager.create(PurchaseUser, { userId }),
            );

            await Promise.all(participants.map((participant) => manager.save(participant)));

            const purchase = await manager.save(Purchase, {
                name,
                value,
                currency,
                creatorId,
                participants,
                event: { id: event.id },
                date: new Date().toISOString(),
            });

            await queryRunner.commitTransaction();

            return {
                purchase: {
                    ...omit(['event'], purchase),
                    participants: purchase.participants.map(({ userId }) => userId),
                },
            };
        } catch (e) {
            await queryRunner.rollbackTransaction();
            return new InternalServerErrorException(e);
        } finally {
            await queryRunner.release();
        }
    }

    public async updatePurchase(purchaseId, body) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const { manager } = queryRunner;
        const purchase = await manager.findOne(Purchase, purchaseId, {
            relations: ['participants', 'event', 'event.users'],
        });
        const eventUsers = purchase.event.users.map(({ userId }) => userId);
        const { name, value, currency, participants, creatorId } = body;

        if (
            !eventUsers.includes(creatorId) ||
            !participants.every((userId) => eventUsers.includes(userId))
        ) {
            throw new ForbiddenException();
        }

        try {
            purchase.name = name;
            purchase.value = value;
            purchase.currency = currency;
            purchase.creatorId = creatorId;
            purchase.participants = await Promise.all<PurchaseUser>(
                participants.map((userId) => manager.save(PurchaseUser, { purchase, userId })),
            );

            await manager.save(purchase);
            await manager.delete(PurchaseUser, { purchase: { id: null } });
            await queryRunner.commitTransaction();

            return {
                purchase: {
                    ...omit(['event'], purchase),
                    participants,
                },
            };
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(e);
        } finally {
            await queryRunner.release();
        }
    }

    public async getOne(purchaseId) {
        const purchase = await this.connection.manager.findOne(Purchase, purchaseId, {
            relations: ['participants'],
        });

        return {
            purchase: {
                ...purchase,
                participants: purchase.participants.map(({ userId }) => userId),
            },
        };
    }

    public async deletePurchase(purchaseId) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const { manager } = queryRunner;

        try {
            await manager.delete(Purchase, purchaseId);
            await queryRunner.commitTransaction();

            return;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(e);
        } finally {
            await queryRunner.release();
        }
    }
}
