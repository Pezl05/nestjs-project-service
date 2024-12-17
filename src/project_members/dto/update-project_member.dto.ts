import { IsString } from 'class-validator';

export class UpdateProjectMemberDto {
    @IsString()
    role: string;
}
