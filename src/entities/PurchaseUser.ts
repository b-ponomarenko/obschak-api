import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Purchase } from './Purchase';

@Entity('purchase_users')
export class PurchaseUser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Purchase, purchase => purchase.participants)
    purchase: Purchase;

    @Column('varchar')
    userId: number;
}
