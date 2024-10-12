import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProjectService } from './project.service';

@Injectable()
export class ProjectTaskService {
  constructor(private readonly projectService: ProjectService) {}

  @Cron('*/1 * * * *')
  async handleExpiredProjects() {
    const currentDate = new Date();
    await this.projectService.updateExpiredProjects(currentDate);
  }
}
