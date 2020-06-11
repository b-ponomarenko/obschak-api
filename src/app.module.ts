import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/Event';
import { Purchase } from './entities/Purchase';
import { EventsController } from './events/events.controller';
import { EventsService } from './events/events.service';
import { ConfigModule } from '@nestjs/config';
import { PurchasesService } from './purchases/purchases.service';
import { PurchasesController } from './purchases/purchases.controller';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'root',
            database: 'obschak',
            entities: [Event, Purchase],
            synchronize: true,
            logging: true
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        })
    ],
    controllers: [AppController, EventsController, PurchasesController],
    providers: [AppService, EventsService, PurchasesService],
})
export class AppModule {}
