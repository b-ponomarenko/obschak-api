import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    UseGuards,
    Param,
    createParamDecorator,
    Put,
    Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEvent } from '../validations/CreateEvent';
import { RolesGuard } from '../guards/roles.guard';
import { CreatePurchase } from '../validations/CreatePurchase';
import { UpdateEvent } from '../validations/UpdateEvent';
import { MemberOfEventGuard } from '../guards/member-of-event.guard';
import { PurchasesService } from '../purchases/purchases.service';
import { CreatorOfEventGuard } from '../guards/creator-of-event.guard';
import { sortUsers } from '../utils/sortUsers';
import isEmpty from '@tinkoff/utils/is/empty';
import { processPurchaseData } from '../purchases/purchases.controller';
import { VkUserId } from '../decorators/VkUserId';

const processEventData = (event, userId) => ({
    ...event,
    users: sortUsers(event.users, userId),
    purchases: isEmpty(event.purchases)
        ? event.purchases
        : event.purchases.map((purchase) => ({
              ...purchase,
              participants: sortUsers(purchase.participants, userId),
          })),
});

@Controller('events')
@UseGuards(RolesGuard)
export class EventsController {
    constructor(private eventsService: EventsService, private purchasesService: PurchasesService) {}

    @Post()
    @HttpCode(200)
    async createEvent(@Body() body: CreateEvent, @VkUserId() userId) {
        return this.eventsService
            .createEvent(userId, body)
            .then((event) => ({ event: processEventData(event, userId) }));
    }

    @UseGuards(MemberOfEventGuard)
    @Put(':eventId')
    async updateEvent(@Body() body: UpdateEvent, @VkUserId() userId, @Param('eventId') eventId) {
        return this.eventsService
            .updateEvent(body, userId, eventId)
            .then((event) => ({ event: processEventData(event, userId) }));
    }

    @Get()
    async getAll(@VkUserId() userId) {
        return this.eventsService.getEvents(userId).then((events) => ({
            events: events.map((event) => processEventData(event, userId)),
        }));
    }

    @UseGuards(MemberOfEventGuard)
    @Get(':eventId')
    async getOne(@Param('eventId') eventId, @VkUserId() userId) {
        return this.eventsService
            .getOneEvent(eventId)
            .then((event) => ({ event: processEventData(event, userId) }));
    }

    @UseGuards(MemberOfEventGuard)
    @Post(':eventId/purchases')
    @HttpCode(200)
    async createPurchase(
        @Body() body: CreatePurchase,
        @Param('eventId') eventId,
        @VkUserId() userId,
    ) {
        return this.purchasesService
            .createPurchase(body, eventId)
            .then((purchase) => ({ purchase: processPurchaseData(purchase, userId) }));
    }

    @UseGuards(CreatorOfEventGuard)
    @Delete(':eventId')
    async deleteEvent(@Param('eventId') eventId) {
        return this.eventsService.deleteEvent(eventId);
    }
}
