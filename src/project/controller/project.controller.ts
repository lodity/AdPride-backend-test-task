import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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

  @Get('projects')
  async list(
    @Request() req,
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('search') search: string,
  ): Promise<ProjectListResponse> {
    const userId = req.user.sub as number;

    const filterParams = {
      where: {
        userId,
        deleted: false,
        OR: [
          { name: { contains: search || '' } },
          { url: { contains: search || '' } },
        ],
      },
    };

    const projects: Project[] = await this.projectService.findMany({
      ...filterParams,
      skip: +offset || 0,
      take: +limit || 10,
    });

    const total = await this.projectService.count(filterParams);

    return {
      data: projects.map((x: Project) => ({
        id: x.id,
        name: x.name,
        url: x.url,
        status: x.status,
        expiredAt: x.expiredAt,
        createdAt: x.createdAt,
        updatedAt: x.updatedAt,
      })),
      total,
      size: projects.length,
      offset: Number(offset) || 0,
      limit: Number(limit) || 10,
    };
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
