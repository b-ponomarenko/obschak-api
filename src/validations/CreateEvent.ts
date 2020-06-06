import { IsDateString, IsOptional, IsString } from 'class-validator';
import { IsUniqArray } from './decorators/IsUniqArray';

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

    @IsUniqArray()
    users: string[];
}
