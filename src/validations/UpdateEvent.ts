import { ArrayUnique, IsDateString, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { IsPicture } from './decorators/IsPicture';

export class UpdateEvent {
    @IsNumber()
    id: number;

    @IsString()
    @Length(1, 30)
    title: string;

    @IsOptional()
    @IsPicture()
    photo: string;

    @IsNumber()
    creatorId: number;

    @IsDateString()
    startDate: Date;

    @IsDateString()
    endDate: Date;

    @ArrayUnique()
    users: string[];
}
