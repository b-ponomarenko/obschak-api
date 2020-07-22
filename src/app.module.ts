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
import { RateLimiterInterceptor, RateLimiterModule } from 'nestjs-rate-limiter';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('TYPEORM_HOST'),
                port: Number(configService.get('TYPEORM_PORT')),
                username: configService.get('TYPEORM_USERNAME'),
                database: configService.get('TYPEORM_DATABASE'),
                password: configService.get('TYPEORM_PASSWORD'),
                entities: [Event, Purchase, Transfer],
                synchronize: false,
                logging: ['error', 'warn'],
            }),
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
        }),
        ScheduleModule.forRoot(),
        RateLimiterModule,
    ],
    controllers: [AppController, EventsController, PurchasesController, TransfersController],
    providers: [
        AppService,
        EventsService,
        PurchasesService,
        TransfersService,
        TasksService,
        VkService,
        {
            provide: APP_INTERCEPTOR,
            useClass: RateLimiterInterceptor,
        },
    ],
})
export class AppModule {}
