import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { EventUser } from '../entities/EventUser';
import { Event } from '../entities/Event';

@Injectable()
export class EventsService {
    private entityManager = getManager();

    public async createEvent(body) {
        const users = body.users.map(id => this.entityManager.create(EventUser, { userId: id }));

        await Promise.all(users.map(user => this.entityManager.save(user)));

        const event = this.entityManager.create(Event, {
            ...body,
            users
        });
        const newEvent = await this.entityManager.save(event);

        return { event: { ...newEvent, users: body.users } }
    }

    public updateEvent() {

    }

    public deleteEvent() {

    }

    public getOneEvent(userId) {

    }

    public async getEvents(userId) {
        const events = await this.entityManager.find(Event, {
            relations: ['users']
        }).then(events => events.filter(({ creatorId, users }) => creatorId === userId || users.includes(userId)))

        return { events: events.map(event => ({ ...event, users: event.users.map(({ userId }) => userId) })) }
    }

    private isMemberOfEvent(userId) {

    }
}
