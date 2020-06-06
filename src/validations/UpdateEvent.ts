import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsUniqArray } from './decorators/IsUniqArray';

export class UpdateEvent {
    @IsNumber()
    id: number;

    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    photo: string;

    @IsNumber()
    creatorId: number;

    @IsDateString()
    startDate: Date;

    @IsDateString()
    endDate: Date;

    @IsUniqArray()
    users: string[];
}
