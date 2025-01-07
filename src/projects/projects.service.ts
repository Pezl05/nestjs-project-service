import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  IsNull,
  ILike,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { plainToClass } from 'class-transformer';

import { Project } from './entities/project.entity';
import { CustomLogger } from 'src/custom-logger.service';

@Injectable()
export class ProjectsService {
  private readonly logger = new CustomLogger();

  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    @Request() req,
  ): Promise<Project | null> {
    try {
      createProjectDto.createdBy = req.user.userId;
      const project = await this.projectsRepository.save(createProjectDto);
      this.logger.log(`Project created successfully: ${project.projectId} ${project.name}`);
      return project;
    } catch (error) {
      this.logger.error(
        `Error occurred while creating a new project\nStack trace: ${error.message}\n${error.stack}`
      );
      throw new Error('An error occurred while creating the project');
    }
  }

  async findAll(
    offset: number = 0,
    limit: number | undefined,
    today: string,
    name: string,
    createdBy: string,
    startDate: string,
    endDate: string = startDate,
    status: string,
  ): Promise<Project[]> {
    try {
      const whereConditions = { deletedAt: IsNull() };
      if (today === 'true') {
        const currentDate = new Date();
        whereConditions['startDate'] = LessThanOrEqual(new Date(currentDate));
        whereConditions['endDate'] = MoreThanOrEqual(new Date(currentDate));
      } else {
        if (startDate && endDate) {
          whereConditions['startDate'] = LessThanOrEqual(new Date(endDate));
          whereConditions['endDate'] = MoreThanOrEqual(new Date(startDate));
        }
      }
      if (name) whereConditions['name'] = ILike(`%${name}%`);
      if (createdBy) whereConditions['createdBy'] = createdBy;
      if (status) whereConditions['status'] = ILike(`${status}`);

      const projects = await this.projectsRepository.find({
        where: whereConditions,
        relations: ['createdBy'],
        skip: offset,
        take: limit ?? undefined,
      });

      return plainToClass(Project, projects);
    } catch (error) {
      this.logger.error(`Error while fetching projects.\nStack trace: ${error.message}\n${error.stack}`);
      throw new Error('An error occurred while fetching projects');
    }
  }

  async findOne(projectId: number): Promise<Project | null> {
    try {
      const project = await this.projectsRepository.findOne({
        where: { projectId, deletedAt: IsNull() },
        relations: ['createdBy'],
      });
      if (!project) {
        throw new NotFoundException('ID not found');
      }

      return plainToClass(Project, project);
    } catch (error) {
      this.logger.error(
        `Error while finding project with ID: ${projectId}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(
    projectId: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project | null> {
    try {
      const project = await this.projectsRepository.findOne({
        where: { projectId, deletedAt: IsNull() },
      });

      if (!project) {
        this.logger.warn(`Project with ID: ${projectId} not found for update.`);
        throw new NotFoundException('Project not found or already deleted');
      }

      updateProjectDto.updatedAt = new Date();

      const result = await this.projectsRepository.update(
        projectId,
        updateProjectDto,
      );

      this.logger.log(`Project updated successfully: ${project.projectId} ${project.name}`);
      return this.projectsRepository.findOne({
        where: { projectId, deletedAt: IsNull() },
      });
    } catch (error) {
      this.logger.error(
        `Error while updating project with ID: ${projectId}.\nStack trace: ${error.message}\n${error.stack}`
      );
      throw error;
    }
  }

  async remove(projectId: number) {
    try {
      const project = await this.projectsRepository.findOne({
        where: { projectId, deletedAt: IsNull() },
      });
      if (!project) {
        this.logger.warn(
          `Project with ID: ${projectId} not found for deletion.`,
        );
        throw new NotFoundException('ID not found');
      }
      project.deletedAt = new Date();
      await this.projectsRepository.save(project);

      this.logger.log(`Project updated successfully: ${project.projectId} ${project.name}`);
      return { message: 'Delete Successful' };
    } catch (error) {
      this.logger.error(
        `Error while deleting project with ID: ${projectId}.\nStack trace: ${error.message}\n${error.stack}`
      );
      throw error;
    }
  }
}
