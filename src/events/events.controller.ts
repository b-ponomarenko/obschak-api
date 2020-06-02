import { Body, Controller, Get, HttpCode, Post, UseGuards, Headers } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEvent } from './CreateEvent';
import { RolesGuard } from '../roles.guard';

@Controller('events')
@UseGuards(RolesGuard)
export class EventsController {
    constructor(private eventsService: EventsService) {}

    @Post()
    @HttpCode(200)
    async createEvent(@Body() body: CreateEvent) {
        return this.eventsService.createEvent(body);
    }

    @Get()
    async getAll(@Headers('vk_user_id') userId) {
        return this.eventsService.getEvents(userId)
    }
}
