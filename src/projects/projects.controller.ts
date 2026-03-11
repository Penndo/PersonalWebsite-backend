import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Project } from './project.entity';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  getProjects(): Promise<Project[]> {
    return this.projectsService.findAll();
  }

  @Get(':id')
  getProject(@Param('id', ParseIntPipe) id: number): Promise<Project> {
    return this.projectsService.getOrFail(id);
  }

  @Post()
  createProject(@Body() data: Partial<Project>): Promise<Project> {
    return this.projectsService.create(data);
  }

  @Put(':id')
  updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Project>,
  ): Promise<Project> {
    return this.projectsService.update(id, data);
  }

  @Delete(':id')
  deleteProject(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.projectsService.remove(id);
  }
}
