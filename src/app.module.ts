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
import { Transfer } from './entities/Transfer';
import { TransfersService } from './transfers/transfers.service';
import { TransfersController } from './transfers/transfers.controller';
import { TasksService } from './tasks/tasks.service';
import { ScheduleModule } from '@nestjs/schedule';
import { VkService } from './vk/vk.service';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'root',
            database: 'obschak',
            entities: [Event, Purchase, Transfer],
            synchronize: true,
            logging: true
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ScheduleModule.forRoot()
    ],
    controllers: [AppController, EventsController, PurchasesController, TransfersController],
    providers: [AppService, EventsService, PurchasesService, TransfersService, TasksService, VkService],
})
export class AppModule {}
