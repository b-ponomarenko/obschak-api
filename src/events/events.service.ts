import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { EventUser } from '../entities/EventUser';
import { Event } from '../entities/Event';
import { Purchase } from '../entities/Purchase';
import { PurchaseUser } from '../entities/PurchaseUser';
import sortBy from '@tinkoff/utils/array/sortBy';

@Injectable()
export class EventsService {
    private entityManager = getManager();

    public async createEvent(userId, body) {
        const users = [userId, ...body.users].map((userId) =>
            this.entityManager.create(EventUser, { userId }),
        );

        await Promise.all(users.map((user) => this.entityManager.save(user)));

        const event = this.entityManager.create(Event, {
            ...body,
            creatorId: userId,
            users,
        });
        const newEvent = await this.entityManager.save(event);

        return { event: { ...newEvent, users: newEvent.users.map(({ userId }) => userId) } };
    }

    public updateEvent() {}

    public deleteEvent() {}

    public async getOneEvent(eventId, userId) {
        const rawEvent = await this.entityManager.findOne(
            Event,
            {
                id: eventId,
            },
            { relations: ['users', 'purchases'] },
        );

        if (!rawEvent) {
            return new BadRequestException(`События с id=${eventId} нет`);
        }

        if (!this.isMemberOfEvent(rawEvent, userId)) {
            return new ForbiddenException();
        }

        const event = {
            ...rawEvent,
            users: rawEvent.users.map(({ userId }) => userId),
            purchases: sortBy(({ date }) => -date, rawEvent.purchases),
        };

        return { event };
    }

    public async getEvents(userId) {
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

    public async createPurchase(data, eventId, userId) {
        const { name, value, currency } = data;
        const event = await this.entityManager.findOne(
            Event,
            { id: eventId },
            { relations: ['users'] },
        );

        if (!event) {
            return new BadRequestException(`События с id=${eventId} нет`);
        }

        if (!this.isMemberOfEvent(event, userId)) {
            return new ForbiddenException();
        }

        const eventUsers = event.users.map(({ userId }) => userId);

        if (
            !data.participants.every((userId) =>
                eventUsers.includes(userId),
            )
        ) {
            return new ForbiddenException();
        }

        const participants = data.participants.map((userId) =>
            this.entityManager.create(PurchaseUser, { userId }),
        );

        await Promise.all(participants.map((participant) => this.entityManager.save(participant)));

        const purchase = this.entityManager.create(Purchase, {
            name,
            value,
            currency,
            creatorId: userId,
            participants,
            event,
            date: new Date().toISOString(),
        });

        return this.entityManager.save(purchase).then(({ event, ...purchase }) => ({
            purchase: {
                ...purchase,
                participants: purchase.participants.map(({ userId }) => userId),
            },
        }));
    }

    public async getOnePurchase(purchaseId) {
        return this.entityManager.findOne(
            Purchase,
            { id: purchaseId },
            {
                relations: ['participants'],
            },
        );
    }

    private isMemberOfEvent(event: Event, userId) {
        return (
            event.creatorId === userId || event.users.map(({ userId }) => userId).includes(userId)
        );
    }
}
