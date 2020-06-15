import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Transfer } from '../entities/Transfer';

@Injectable()
export class TransfersService {
    constructor(private connection: Connection) {}

    createTransfer(body, eventId) {
        return this.connection.manager.save(Transfer, {
            ...body,
            event: { id: eventId }
        })
    }

    deleteTransfer(transferId) {
        return this.connection.manager.delete(Transfer, transferId);
    }
}
