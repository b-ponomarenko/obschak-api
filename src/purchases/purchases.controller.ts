import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { MemberOfPurchaseGuard } from '../guards/member-of-purchase.guard';
import { UpdatePurchase } from '../validations/UpdatePurchase';
import { RolesGuard } from '../guards/roles.guard';
import { sortUsers } from '../utils/sortUsers';
import { VkUserId } from '../decorators/VkUserId';
import { RateLimit } from 'nestjs-rate-limiter';

export const processPurchaseData = (purchase, userId) => ({
    ...purchase,
    participants: sortUsers(purchase.participants, userId),
});

@Controller('purchases')
@UseGuards(RolesGuard)
export class PurchasesController {
    constructor(private purchasesService: PurchasesService) {}

    @UseGuards(MemberOfPurchaseGuard)
    @Get(':purchaseId')
    async getPurchase(@Param('purchaseId') purchaseId, @VkUserId() userId) {
        return this.purchasesService
            .getOne(purchaseId)
            .then((purchase) => ({ purchase: processPurchaseData(purchase, userId) }));
    }

    @UseGuards(MemberOfPurchaseGuard)
    @RateLimit({ points: 5, duration: 10 })
    @Delete(':purchaseId')
    async deletePurchase(@Param('purchaseId') purchaseId) {
        return this.purchasesService.deletePurchase(purchaseId);
    }

    @UseGuards(MemberOfPurchaseGuard)
    @RateLimit({ points: 5, duration: 10 })
    @Put(':purchaseId')
    async updatePurchase(
        @Param('purchaseId') purchaseId,
        @Body() body: UpdatePurchase,
        @VkUserId() userId,
    ) {
        return this.purchasesService
            .updatePurchase(purchaseId, body)
            .then((purchase) => ({ purchase: processPurchaseData(purchase, userId) }));
    }
}
