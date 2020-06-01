import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEvent } from './CreateEvent';

@Controller('events')
export class EventsController {
    constructor(private eventsService: EventsService) {}

    @Post()
    @HttpCode(200)
    async createEvent(@Body() body: CreateEvent) {
        return this.eventsService.createEvent(body);
    }

    @Get()
    async getAll() {
        return []
    }
}
