import { IsString,IsOptional } from 'class-validator';

export class CreateProjectDto {
    readonly projectId?: number;

    @IsString()
    name: string;

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
