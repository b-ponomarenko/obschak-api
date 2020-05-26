import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { Purchase } from './Purchase';

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    title: string;

    @Column('varchar')
    photo: string;

    @Column('timestamp')
    startDate: string;

    @Column('timestamp')
    endDate: string;

    @OneToOne(() => User, { cascade: ['update'] })
    @JoinColumn()
    creator: User;

    @ManyToMany(() => User, { cascade: ['update'] })
    @JoinTable()
    users: User[];

    @OneToMany(() => Purchase, purchase => purchase.event, { cascade: true })
    purchases: Purchase[];
}
