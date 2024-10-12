import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from '../service/project.service';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { ProjectListResponse } from '../dto/project-list-response.dto';
import { Project } from '@prisma/client';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@UseGuards(AuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async list(@Request() req): Promise<ProjectListResponse> {
    const userId = req.user.sub as number;

    const list: Project[] = await this.projectService.findMany({
      where: { userId, deleted: false },
    });

    return list.map((x: Project) => ({
      id: x.id,
      name: x.name,
      url: x.url,
      status: x.status,
      expiredAt: x.expiredAt,
      createdAt: x.createdAt,
      updatedAt: x.updatedAt,
    }));
  }

  @Post()
  async create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    const userId = req.user.sub as number;

    return await this.projectService.create({
      ...createProjectDto,
      userId,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return await this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.projectService.markAsDeleted(+id);
  }
}
