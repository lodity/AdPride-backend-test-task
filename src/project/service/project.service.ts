import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma';
import { Prisma, Project } from '@prisma/client';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { CreateProjectWithUserIdDto } from '../dto/create-project-with-userid.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(args: Prisma.ProjectFindManyArgs): Promise<Project[]> {
    return this.prismaService.project.findMany(args);
  }

  async create(createProjectDto: CreateProjectWithUserIdDto) {
    return this.prismaService.project.create({ data: createProjectDto });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.prismaService.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async markAsDeleted(id: number) {
    return this.prismaService.project.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
