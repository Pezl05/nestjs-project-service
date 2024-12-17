import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, ILike, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, @Request() req): Promise<Project | null> {
    createProjectDto.createdBy = req.user.userId;
    return this.projectsRepository.save(createProjectDto);
  }

  async findAll(
    offset: number = 0,
    limit: number | undefined,
    today: string,
    name: string,
    createdBy: string,
    startDate: string,
    endDate: string = startDate,
    status: string
  ): Promise<Project[]> {
    const whereConditions = { deletedAt: IsNull() };
    if (today === 'true') {
      const currentDate = new Date();
      whereConditions['startDate'] = LessThanOrEqual(new Date(currentDate));
      whereConditions['endDate'] = MoreThanOrEqual(new Date(currentDate));
    } else{
      if (startDate && endDate) {
        whereConditions['startDate'] = LessThanOrEqual(new Date(endDate));
        whereConditions['endDate'] = MoreThanOrEqual(new Date(startDate));
      }
    }
    if (name) 
      whereConditions['name'] = ILike(`%${name}%`);
    if (createdBy)
      whereConditions['createdBy'] = createdBy;
    if (status) 
      whereConditions['status'] = ILike(`${status}`);

    const projects = await this.projectsRepository.find({
      where: whereConditions,
      relations: ['createdBy'],
      skip: offset,
      take: limit ?? undefined,
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
