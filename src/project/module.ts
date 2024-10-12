import { Module } from '@nestjs/common';
import { ProjectController } from './controller/project.controller';
import { ProjectService } from './service/project.service';
import { PrismaService } from '../lib/prisma';
import { ProjectTaskService } from './service/project-task.service';

@Module({
  imports: [],
  controllers: [ProjectController],
  providers: [ProjectService, PrismaService, ProjectTaskService],
})
export class ProjectModule {}
