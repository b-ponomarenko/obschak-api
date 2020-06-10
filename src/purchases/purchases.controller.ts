import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { MemberOfPurchaseGuard } from '../member-of-purchase.guard';
import { UpdatePurchase } from '../validations/UpdatePurchase';

@Controller('purchases')
export class PurchasesController {
    constructor(private purchasesService: PurchasesService) {}

    @UseGuards(MemberOfPurchaseGuard)
    @Get(':purchaseId')
    async getPurchase(@Param('purchaseId') purchaseId) {
        return this.purchasesService.getOne(purchaseId);
    }

    @UseGuards(MemberOfPurchaseGuard)
    @Delete(':purchaseId')
    async deletePurchase(@Param('purchaseId') purchaseId) {
        return this.purchasesService.deletePurchase(purchaseId);
    }

    @UseGuards(MemberOfPurchaseGuard)
    @Put(':purchaseId')
    async updatePurchase(@Param('purchaseId') purchaseId, @Body() body: UpdatePurchase) {
        return this.purchasesService.updatePurchase(purchaseId, body);
    }
}
