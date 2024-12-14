import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectMemberDto } from './dto/create-project_member.dto';
import { UpdateProjectMemberDto } from './dto/update-project_member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { ProjectMember } from './entities/project_member.entity';


@Injectable()
export class ProjectMembersService {
  constructor(
    @InjectRepository(ProjectMember)
    private projectMemberRepository: Repository<ProjectMember>,
  ) {}

  async create(createProjectMemberDto: CreateProjectMemberDto): Promise<ProjectMember | null> {
    return this.projectMemberRepository.save(createProjectMemberDto);
  }

  async findAll(): Promise<ProjectMember[]> {
    const projectMembers = await this.projectMemberRepository.find({ 
      relations: ['projectId','userId'],
    });

    return plainToClass(ProjectMember, projectMembers);
  }

  async findByProject(projectId: number): Promise<ProjectMember[]> {
    try{
      const projectMembers = await this.projectMemberRepository.findAndCount({ 
        where: { projectId: projectId },
        relations: ['projectId','userId'],
      });
      if(!projectMembers){
        throw new NotFoundException("Project not found");
      }

      return plainToClass(ProjectMember, projectMembers);
    } catch(error) {
      throw error;
    }
  }

  async findByUser(userId: number): Promise<ProjectMember[]> {
    try{
      const projectMembers = await this.projectMemberRepository.findAndCount({ 
        where: { userId: userId },
        relations: ['projectId','userId'],
      });
      if(!projectMembers){
        throw new NotFoundException("Member not found");
      }

      return plainToClass(ProjectMember, projectMembers);
    } catch(error) {
      throw error;
    }
  }

  async update(projectMemberId: number, updateProjectMemberDto: UpdateProjectMemberDto): Promise<ProjectMember | null> {
    try{
      const projectMember = await this.projectMemberRepository.findOneBy({ projectMemberId });
      if (!projectMember) {
        throw new NotFoundException('Member not found');
      }

      await this.projectMemberRepository.update(projectMemberId, updateProjectMemberDto);
      const result = await this.projectMemberRepository.findOne({ 
        where: { projectMemberId }, 
        relations: ['projectId','userId']
      });

      return plainToClass(ProjectMember, result);
    } catch(error) {
      throw error;
    }
  }

  async remove(projectMemberId: number) {
    try{
      const projectMember = await this.projectMemberRepository.delete(projectMemberId);
      if(!projectMember){
        throw new NotFoundException("Member not found");
      }

      return { message: "Delete Successful" };
    } catch(error) {
      throw error;
    }
  }
}
