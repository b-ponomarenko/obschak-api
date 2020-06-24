import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './Event';

@Entity('transfers')
export class Transfer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int4')
    from: number;

    @Column('int4')
    to: number;

    @Column('real')
    value: number;

    @Column('varchar')
    currency: string;

    @ManyToOne(() => Event, (event) => event.transfers, { onDelete: 'CASCADE' })
    event: Event;
}
