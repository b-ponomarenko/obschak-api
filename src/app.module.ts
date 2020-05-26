import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/Event';
import { User } from './entities/User';
import { Purchase } from './entities/Purchase';
import { EventsController } from './events/events.controller';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'root',
            database: 'obschak',
            entities: [Event, User, Purchase],
            synchronize: true,
        }),
    ],
    controllers: [AppController, EventsController],
    providers: [AppService],
})
export class AppModule {}
