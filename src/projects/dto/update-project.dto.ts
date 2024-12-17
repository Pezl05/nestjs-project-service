import { IsString,IsOptional } from 'class-validator';

export class UpdateProjectDto {
    @IsString()
    name: string;

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
