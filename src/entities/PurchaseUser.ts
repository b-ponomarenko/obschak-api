import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Purchase } from './Purchase';

@Entity('purchases_users')
export class PurchaseUser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Purchase, purchase => purchase.participants)
    purchase: Purchase;

    @Column('varchar')
    userId: string;
}
