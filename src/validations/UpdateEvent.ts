import { ArrayUnique, IsDateString, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { IsPicture } from './decorators/IsPicture';
import { MoreThan } from './decorators/date/MoreThan';

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
    @MoreThan(undefined, { message: 'startDate should be future date' })
    startDate: Date;

    @IsDateString()
    @MoreThan('startDate', { message: 'endDate should be more than startDate' })
    endDate: Date;

    @ArrayUnique()
    users: string[];
}
