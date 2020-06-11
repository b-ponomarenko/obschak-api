import { Injectable, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
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
            const { name, value, currency, creatorId, participants } = body;
            const event = await this.eventsService.getOneEvent(eventId);

            if (
                !participants.every((userId) => event.users.includes(userId)) ||
                !event.users.includes(creatorId)
            ) {
                throw new ForbiddenException();
            }

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

            return omit(['event'], purchase);
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
            relations: ['event'],
        });
        const { name, value, currency, participants, creatorId } = body;

        if (
            !purchase.event.users.includes(creatorId) ||
            !participants.every((userId) => purchase.event.users.includes(userId))
        ) {
            throw new ForbiddenException();
        }

        try {
            purchase.name = name;
            purchase.value = value;
            purchase.currency = currency;
            purchase.creatorId = creatorId;
            purchase.participants = participants;

            await manager.save(purchase);
            await queryRunner.commitTransaction();

            return omit(['event'], purchase);
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(e);
        } finally {
            await queryRunner.release();
        }
    }

    public async getOne(purchaseId) {
        return this.connection.manager.findOne(Purchase, purchaseId);
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
