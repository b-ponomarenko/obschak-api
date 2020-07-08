import { ArrayUnique, Equals, IsNumber, IsOptional, IsPositive, IsString, Length } from 'class-validator';
import { PictureArray } from './decorators/PictureArray';

export class UpdatePurchase {
    @IsNumber()
    id: number;

    @IsString()
    @Length(1, 30)
    name: string;

    @IsNumber()
    @IsPositive()
    value: number;

    @Equals('RUB')
    currency: string;

    @IsNumber()
    creatorId: number;

    @ArrayUnique()
    participants: number[];

    @IsOptional()
    @PictureArray()
    receipts: string[]
}
