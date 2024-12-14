import { Test, TestingModule } from '@nestjs/testing';
import { ProjectMembersController } from './project_members.controller';
import { ProjectMembersService } from './project_members.service';

describe('ProjectMembersController', () => {
  let controller: ProjectMembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectMembersController],
      providers: [ProjectMembersService],
    }).compile();

    controller = module.get<ProjectMembersController>(ProjectMembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
