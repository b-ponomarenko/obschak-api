import { IsNumber, IsString } from 'class-validator';

export class CreateTransfer {
    @IsNumber()
    from: number;

    @IsNumber()
    to: number;

    @IsNumber()
    value: number;

    @IsString()
    currency: string;
}
