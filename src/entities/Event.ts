import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventUser } from './EventUser';
import { Purchase } from './Purchase';

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    title: string;

    @Column('varchar', { nullable: true })
    photo: string;

    @Column('timestamp')
    startDate: string;

    @Column('timestamp')
    endDate: string;

    @Column('int4')
    creatorId: number;

    @OneToMany(() => EventUser, (eventUser) => eventUser.event)
    users: EventUser[];

    @OneToMany(() => Purchase, (purchase) => purchase.event)
    purchases: Purchase[];
}
