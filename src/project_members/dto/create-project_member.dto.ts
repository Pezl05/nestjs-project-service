import { IsString, IsNumber,IsOptional } from 'class-validator';

export class CreateProjectMemberDto {
    readonly projectMemberId?: number;

    @IsNumber()
    projectId: number;

    @IsNumber()
    userId: number;

    @IsString()
    role: string;

    readonly joinedAt?: Date;
}
