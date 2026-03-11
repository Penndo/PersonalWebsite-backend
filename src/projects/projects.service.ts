import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      order: { id: 'ASC' },
    });
  }

  async getOrFail(id: number): Promise<Project> {
    const found = await this.projectRepository.findOne({ where: { id } });
    if (found === null) {
      throw new NotFoundException('Project not found');
    }
    return found;
  }

  create(data: Partial<Project>): Promise<Project> {
    const entity = this.projectRepository.create({
      title: data.title ?? '',
      routeId: data.routeId ?? `project-${Date.now()}`,
      summary: data.summary ?? '',
      content: data.content ?? null,
      coverUrl: data.coverUrl ?? null,
      tags: data.tags ?? null,
    });
    return this.projectRepository.save(entity);
  }

  async update(id: number, data: Partial<Project>): Promise<Project> {
    const existing = await this.getOrFail(id);
    const merged = this.projectRepository.merge(existing, data);
    return this.projectRepository.save(merged);
  }

  async remove(id: number): Promise<void> {
    await this.projectRepository.delete({ id });
  }
}
