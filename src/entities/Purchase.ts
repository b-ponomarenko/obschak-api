import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './Event';

@Entity('purchases')
export class Purchase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string;

    @Column('real')
    value: number;

    @Column('varchar')
    currency: string;

    @Column('int4')
    creatorId: number;

    @Column('timestamp')
    date: string;

    @ManyToOne(() => Event, (event) => event.purchases, { onDelete: 'CASCADE' })
    event: Event;

    @Column('json')
    participants: number[];

    @Column({ type: 'json', default: [] })
    receipts: string[]
}
