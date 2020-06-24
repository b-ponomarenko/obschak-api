import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/Event';
import { Purchase } from './entities/Purchase';
import { EventsController } from './events/events.controller';
import { EventsService } from './events/events.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
        TypeOrmModule.forRootAsync({
            imports: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('DB_HOST'),
                port: Number(configService.get('DB_PORT')),
                username: configService.get('DB_USER'),
                database: configService.get('DB_NAME'),
                password: configService.get('DB_PASS'),
                entities: [Event, Purchase, Transfer],
                synchronize: process.env.NODE_ENV !== 'production',
                logging: ['error', 'warn'],
            }),
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
    ],
    controllers: [AppController, EventsController, PurchasesController, TransfersController],
    providers: [
        AppService,
        EventsService,
        PurchasesService,
        TransfersService,
        TasksService,
        VkService,
    ],
})
export class AppModule {}
