import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMembersService } from './project_members.service';
import { ProjectMembersController } from './project_members.controller';
import { ProjectMember } from './entities/project_member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectMember])
  ],
  controllers: [ProjectMembersController],
  providers: [ProjectMembersService],
})
export class ProjectMembersModule {}
