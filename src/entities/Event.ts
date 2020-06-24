import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Purchase } from './Purchase';
import { Transfer } from './Transfer';

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

    @Column('int')
    creatorId: number;

    @Column({ type: 'text', transformer: { to: JSON.stringify, from: JSON.parse } })
    users: number[];

    @OneToMany(() => Purchase, (purchase) => purchase.event)
    purchases: Purchase[];

    @OneToMany(() => Transfer, (transfer) => transfer.event)
    transfers: Transfer[];
}
