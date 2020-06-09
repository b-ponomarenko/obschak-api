import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { MemberOfPurchaseGuard } from '../member-of-purchase.guard';

@Controller('purchases')
export class PurchasesController {
    constructor(private purchasesService: PurchasesService) {}

    @UseGuards(MemberOfPurchaseGuard)
    @Get(':purchaseId')
    async getPurchase(@Param('purchaseId') purchaseId) {
        return this.purchasesService.getOne(purchaseId);
    }
}
