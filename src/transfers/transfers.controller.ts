import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { MemberOfTransferGuard } from '../guards/member-of-transfer.guard';
import { TransfersService } from './transfers.service';
import { RolesGuard } from '../guards/roles.guard';
import { RateLimit } from 'nestjs-rate-limiter';

@Controller('transfers')
@UseGuards(RolesGuard)
export class TransfersController {
    constructor(private transfersService: TransfersService) {}

    @RateLimit({ points: 5, duration: 10 })
    @Delete(':transferId')
    @UseGuards(MemberOfTransferGuard)
    async deleteTransfer(@Param('transferId') transferId) {
        return this.transfersService.deleteTransfer(transferId);
    }
}
