import { Body, Controller, Get, HttpCode, Post, UseGuards, Headers, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEvent } from './CreateEvent';
import { RolesGuard } from '../roles.guard';
import { CreatePurchase } from './CreatePurchase';

@Controller('events')
@UseGuards(RolesGuard)
export class EventsController {
    constructor(private eventsService: EventsService) {}

    @Post()
    @HttpCode(200)
    async createEvent(@Body() body: CreateEvent, @Headers('vk_user_id') userId) {
        return this.eventsService.createEvent(userId, body);
    }

    @Get()
    async getAll(@Headers('vk_user_id') userId) {
        return this.eventsService.getEvents(userId);
    }

    @Get(':eventId')
    async getOne(@Headers('vk_user_id') userId, @Param('eventId') eventId) {
        return this.eventsService.getOneEvent(eventId, userId);
    }

    @Post(':eventId/purchases')
    @HttpCode(200)
    async createPurchase(
        @Headers('vk_user_id') userId,
        @Body() body: CreatePurchase,
        @Param('eventId') eventId,
    ) {
        return this.eventsService.createPurchase(body, eventId, userId);
    }
}
