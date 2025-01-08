import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateProjectMemberDto } from './dto/create-project_member.dto';
import { UpdateProjectMemberDto } from './dto/update-project_member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, ILike } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { ProjectMember } from './entities/project_member.entity';
import { CustomLogger } from 'src/custom-logger.service';

@Injectable()
export class ProjectMembersService {
  private readonly logger = new CustomLogger();

  constructor(
    @InjectRepository(ProjectMember)
    private projectMemberRepository: Repository<ProjectMember>,
  ) {}

  async create(
    createProjectMemberDto: CreateProjectMemberDto,
  ): Promise<ProjectMember | null> {
    try {
      const projectMembers = await this.projectMemberRepository.findOne({
        where: {
          projectId: createProjectMemberDto.projectId,
          userId: createProjectMemberDto.userId,
        },
        relations: ['projectId', 'userId'],
      });

      if (projectMembers) {
        throw new BadRequestException('Member already exists');
      }

      const newMember = await this.projectMemberRepository.save(
        createProjectMemberDto,
      );
      this.logger.log(
        `Project member with userId: ${createProjectMemberDto.userId} added successfully to projectId: ${createProjectMemberDto.projectId}.`,
      );
      return newMember;
    } catch (error) {
      this.logger.error(
        `Error while creating project member with projectId: ${createProjectMemberDto.projectId} and userId: ${createProjectMemberDto.userId}.\nStack trace: ${error.message}\n${error.stack}`
      );
      throw error;
    }
  }

  async findAll(
    offset: number = 0,
    limit: number | undefined,
    project_id: number,
    user_id: number,
    role: string,
  ): Promise<ProjectMember[]> {
    try {
      const whereConditions: any = {};
      if (project_id) whereConditions['projectId'] = project_id;
      if (user_id) whereConditions['userId'] = user_id;
      if (role) whereConditions['role'] = ILike(`${role}`);

      const projectMembers = await this.projectMemberRepository
      .createQueryBuilder('project_member')
      .leftJoinAndSelect('project_member.userId', 'user')
      .where(whereConditions)
      .andWhere('user.deleted_at IS NULL')
      .andWhere('user.userId IS NOT NULL')
      .skip(offset)
      .take(limit ?? undefined)
      .getMany();

      return plainToClass(ProjectMember, projectMembers);
    } catch (error) {
      this.logger.error(`Error while fetching project members.\nStack trace: ${error.message}\n${error.stack}`);
      throw error;
    }
  }

  // async findByProject(projectId: number): Promise<ProjectMember[]> {
  //   try{
  // const projectMembers = await this.projectMemberRepository.findAndCount({
  //   where: { projectId: projectId },
  //   relations: ['projectId','userId'],
  // });
  // if(!projectMembers){
  //   throw new NotFoundException("Project not found");
  // }

  //     return plainToClass(ProjectMember, projectMembers);
  //   } catch(error) {
  //     throw error;
  //   }
  // }

  // async findByUser(userId: number): Promise<ProjectMember[]> {
  //   try{
  //     const projectMembers = await this.projectMemberRepository.findAndCount({
  //       where: { userId: userId },
  //       relations: ['projectId','userId'],
  //     });
  //     if(!projectMembers){
  //       throw new NotFoundException("Member not found");
  //     }

  //     return plainToClass(ProjectMember, projectMembers);
  //   } catch(error) {
  //     throw error;
  //   }
  // }

  async update(
    projectMemberId: number,
    updateProjectMemberDto: UpdateProjectMemberDto,
  ): Promise<ProjectMember | null> {
    try {
      const projectMember = await this.projectMemberRepository.findOneBy({
        projectMemberId,
      });
      if (!projectMember) {
        this.logger.warn(`Project member with ID: ${projectMemberId} not found for update.`);
        throw new NotFoundException('Member not found');
      }

      await this.projectMemberRepository.update(
        projectMemberId,
        updateProjectMemberDto,
      );

      const result = await this.projectMemberRepository.findOne({
        where: { projectMemberId },
        relations: ['projectId', 'userId'],
      });

      this.logger.log(
        `Project member with userId: ${projectMember.userId} added successfully to projectId: ${projectMember.projectId}.`,
      );

      return plainToClass(ProjectMember, result);
    } catch (error) {
      this.logger.error(
        `Error while updating project member with ID: ${projectMemberId}\nStack trace: ${error.message}\n${error.stack}`,
      );
      throw error;
    }
  }

  async remove(projectMemberId: number) {
    try {
      const projectMember = await this.projectMemberRepository.findOneBy({
        projectMemberId,
      });

      if (!projectMember) {
        throw new NotFoundException('Member not found');
      }

      await this.projectMemberRepository.delete(projectMemberId);
      this.logger.log(
        `Project member ${projectMember.userId} deleted successfully.`,
      );
      return { message: 'Delete Successful' };
    } catch (error) {
      this.logger.error(
        `Error while deleting project member with ID: ${projectMemberId}\nStack trace: ${error.message}\n${error.stack}`,
      );
      throw error;
    }
  }
}
