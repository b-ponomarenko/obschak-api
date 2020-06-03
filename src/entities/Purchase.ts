import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './Event';
import { PurchaseUser } from './PurchaseUser';

@Entity('purchases')
export class Purchase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string;

    @Column('int4')
    value: number;

    @Column('varchar')
    currency: string;

    @Column('int4')
    creatorId: string;

    @Column('timestamp')
    date: string;

    @ManyToOne(() => Event, (event) => event.purchases, { cascade: ['update'] })
    event: Event;

    @OneToMany(() => PurchaseUser, (purchaseUser) => purchaseUser.purchase, { cascade: true })
    participants: PurchaseUser[];
}
