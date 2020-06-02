import { IsArray, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEvent {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    photo: string;

    @IsDateString()
    startDate: Date;

    @IsDateString()
    endDate: Date;

    @IsNumber()
    creatorId: number;

    @IsArray()
    users: number[];
}
