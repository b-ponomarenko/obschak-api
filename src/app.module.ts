import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/Event';
import { Purchase } from './entities/Purchase';
import { EventsController } from './events/events.controller';
import { EventUser } from './entities/EventUser';
import { PurchaseUser } from './entities/PurchaseUser';
import { EventsService } from './events/events.service';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'root',
            database: 'obschak',
            entities: [Event, EventUser, Purchase, PurchaseUser],
            synchronize: true,
            logging: true
        }),
    ],
    controllers: [AppController, EventsController],
    providers: [AppService, EventsService],
})
export class AppModule {}
