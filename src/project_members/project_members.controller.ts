import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectMembersService } from './project_members.service';
import { CreateProjectMemberDto } from './dto/create-project_member.dto';
import { UpdateProjectMemberDto } from './dto/update-project_member.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('project-members')
export class ProjectMembersController {
  constructor(private readonly projectMembersService: ProjectMembersService) {}

  @Roles('admin')
  @Post()
  create(@Body() createProjectMemberDto: CreateProjectMemberDto) {
    return this.projectMembersService.create(createProjectMemberDto);
  }

  @Get()
  findAll() {
    return this.projectMembersService.findAll();
  }

  @Get('project/:id')
  findByProject(@Param('id') id: string) {
    return this.projectMembersService.findByProject(+id);
  }

  @Get('user/:id')
  findByUser(@Param('id') id: string) {
    return this.projectMembersService.findByUser(+id);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectMemberDto: UpdateProjectMemberDto) {
    return this.projectMembersService.update(+id, updateProjectMemberDto);
  }


  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectMembersService.remove(+id);
  }
}
