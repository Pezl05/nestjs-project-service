import { IsString, IsNumber,IsOptional } from 'class-validator';
// import { User } from '../entities/user.entity';

export class CreateProjectDto {
    readonly projectId?: number;

    @IsString()
    name: string;

    @IsNumber()
    createdBy: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsOptional()
    startDate?: Date;

    @IsOptional()
    endDate?: Date;

    @IsOptional()
    deletedAt?: Date;
}
