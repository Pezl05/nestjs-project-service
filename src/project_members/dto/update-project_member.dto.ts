import { IsString, IsNumber,IsOptional } from 'class-validator';

export class UpdateProjectMemberDto {
    @IsString()
    role: string;
}
