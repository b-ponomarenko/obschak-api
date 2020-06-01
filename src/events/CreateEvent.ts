import { IsArray, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEvent {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    photo: string;

    @IsDate()
    startDate: Date;

    @IsDate()
    endDate: Date;

    @IsNumber()
    creatorId: number;

    @IsArray()
    users: number[];
}
