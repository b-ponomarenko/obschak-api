import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreatePurchase {
    @IsString()
    name: string;

    @IsNumber()
    value: number;

    @IsString()
    currency: string;

    @IsArray()
    participants: number[];
}
