import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { Event } from './Event';

@Entity()
export class Purchase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string;

    @Column('int4')
    value: number;

    @Column('varchar')
    currency: string;

    @OneToOne(() => User, { cascade: true })
    @JoinColumn()
    creator: User;

    @Column('timestamp')
    date: string;

    @ManyToOne(() => Event, event => event.purchases, { cascade: ['update'] })
    event: Event;

    @ManyToMany(() => User, { cascade: true })
    @JoinTable()
    participants: User[];
}
