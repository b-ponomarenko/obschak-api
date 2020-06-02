import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { EventUser } from '../entities/EventUser';
import { Event } from '../entities/Event';

@Injectable()
export class EventsService {
    private entityManager = getManager();

    public async createEvent(body) {
        const users = [body.creatorId, ...body.users].map(id => this.entityManager.create(EventUser, { userId: id }));

        await Promise.all(users.map(user => this.entityManager.save(user)));

        const event = this.entityManager.create(Event, {
            ...body,
            users
        });
        const newEvent = await this.entityManager.save(event);

        return { event: { ...newEvent, users: newEvent.users.map(({ userId }) => userId) } }
    }

    public updateEvent() {

    }

    public deleteEvent() {

    }

    public async getOneEvent(eventId, userId) {
        const rawEvent = await this.entityManager.findOne(Event, {
            id: eventId
        }, { relations: ['users', 'purchases'] })

        if (!rawEvent) {
            return new BadRequestException(`События с id=${eventId} нет`)
        }

        if (!this.isMemberOfEvent(rawEvent, userId)) {
            return new ForbiddenException()
        }

        const event = { ...rawEvent, users: rawEvent.users.map(({ userId }) => userId) };

        return { event };
    }

    public async getEvents(userId) {
        const events = await this.entityManager.find(Event, {
            relations: ['users']
        }).then(events => events.filter((event) => this.isMemberOfEvent(event, userId)));

        return { events: events.map(event => ({ ...event, users: event.users.map(({ userId }) => userId) })) }
    }

    private isMemberOfEvent(event: Event, userId) {
        return event.creatorId === userId || event.users.map(({ userId }) => userId).includes(userId);
    }
}
