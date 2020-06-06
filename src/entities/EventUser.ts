import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './Event';

@Entity('events_users')
export class EventUser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Event, (event) => event.users, { onDelete: 'CASCADE' })
    event: Event;

    @Column('int4')
    userId: number;
}
