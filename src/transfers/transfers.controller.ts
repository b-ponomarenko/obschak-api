import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { MemberOfTransferGuard } from '../guards/member-of-transfer.guard';
import { TransfersService } from './transfers.service';

@Controller('transfers')
export class TransfersController {
    constructor(private transfersService: TransfersService) {}

    @Delete(':transferId')
    @UseGuards(MemberOfTransferGuard)
    async deleteTransfer(@Param('transferId') transferId) {
        return this.transfersService.deleteTransfer(transferId);
    }
}
