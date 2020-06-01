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

    public getOneEvent() {

    }

    public getEvents() {
        return []
    }

    private isMemberOfEvent(userId) {

    }
}
