import { Body, Controller, Get, HttpCode, Post, UseGuards, Param, createParamDecorator, Put } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEvent } from '../validations/CreateEvent';
import { RolesGuard } from '../roles.guard';
import { CreatePurchase } from '../validations/CreatePurchase';
import { UpdateEvent } from '../validations/UpdateEvent';
import { MemberOfEventGuard } from '../member-of-event.guard';
import { PurchasesService } from '../purchases/purchases.service';

const VkUserId = createParamDecorator((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return Number(request.headers['vk_user_id']);
})

@Controller('events')
@UseGuards(RolesGuard)
export class EventsController {
    constructor(private eventsService: EventsService, private purchasesService: PurchasesService) {}

    @Post()
    @HttpCode(200)
    async createEvent(@Body() body: CreateEvent, @VkUserId() userId) {
        return this.eventsService.createEvent(userId, body);
    }

    @UseGuards(MemberOfEventGuard)
    @Put(':eventId')
    async updateEvent(@Body() body: UpdateEvent, @VkUserId() userId, @Param('eventId') eventId) {
        return this.eventsService.updateEvent(body, userId, eventId)
    }

    @Get()
    async getAll(@VkUserId() userId) {
        return this.eventsService.getEvents(userId);
    }

    @UseGuards(MemberOfEventGuard)
    @Get(':eventId')
    async getOne(@Param('eventId') eventId) {
        return this.eventsService.getOneEvent(eventId);
    }

    @UseGuards(MemberOfEventGuard)
    @Post(':eventId/purchases')
    @HttpCode(200)
    async createPurchase(
        @VkUserId() userId,
        @Body() body: CreatePurchase,
        @Param('eventId') eventId,
    ) {
        return this.purchasesService.createPurchase(body, eventId, userId);
    }
}
