import { Equals, IsNumber, IsPositive } from 'class-validator';

export class CreateTransfer {
    @IsNumber()
    from: number;

    @IsNumber()
    to: number;

    @IsNumber()
    @IsPositive()
    value: number;

    @Equals('RUB')
    currency: string;
}
