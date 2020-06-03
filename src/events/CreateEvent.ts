import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

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

    @IsArray()
    users: string[];
}
