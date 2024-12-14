import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project | null> {
    return this.projectsRepository.save(createProjectDto);
  }

  async findAll(): Promise<Project[]> {
    const projects = await this.projectsRepository.find({ 
      where: { deletedAt: IsNull() },
      relations: ['createdBy'],
    });

    return plainToClass(Project, projects);
  }

  async findOne(projectId: number): Promise<Project | null> {
    try{
      const project = await this.projectsRepository.findOne({ 
        where: { projectId, deletedAt: IsNull() },
        relations: ['createdBy'],
      });
      if(!project){
        throw new NotFoundException("ID not found");
      }

      return plainToClass(Project, project);

    } catch(error) {
      throw error;
    }
  }

  async update(projectId: number, updateProjectDto: UpdateProjectDto): Promise<Project | null> {
    const project = await this.projectsRepository.findOne({
      where: { projectId, deletedAt: IsNull() },
    });
  
    if (!project) {
      throw new NotFoundException('Project not found or already deleted');
    }

    const result = await this.projectsRepository.update(projectId, updateProjectDto);
    return this.projectsRepository.findOne({ where: { projectId, deletedAt: IsNull() } });
  }

  async remove(projectId: number) {
    try{
      const project = await this.projectsRepository.findOne({ where: { projectId, deletedAt: IsNull() } });
      if(!project){
        throw new NotFoundException("ID not found");
      }
      project.deletedAt = new Date();
      this.projectsRepository.save(project);
      return { message: "Delete Successful" };

    } catch(error) {
      throw error;
    }
  }
}
