import { IsNumber, IsString } from 'class-validator';
import { IsUniqArray } from './decorators/IsUniqArray';

export class CreatePurchase {
    @IsString()
    name: string;

    @IsNumber()
    value: number;

    @IsString()
    currency: string;

    @IsNumber()
    creatorId: number;

    @IsUniqArray()
    participants: number[];
}
