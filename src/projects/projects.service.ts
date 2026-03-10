import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  findAll(): Promise<Project[]> {
    return this.projectRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number): Promise<Project | null> {
    return this.projectRepo.findOne({ where: { id } });
  }

  async getOrFail(id: number): Promise<Project> {
    const found = await this.findOne(id);
    if (!found) {
      throw new NotFoundException('Project not found');
    }
    return found;
  }

  create(data: Partial<Project>): Promise<Project> {
    const entity = this.projectRepo.create(data);
    return this.projectRepo.save(entity);
  }

  async update(id: number, data: Partial<Project>): Promise<Project> {
    const existing = await this.getOrFail(id);
    const merged = this.projectRepo.merge(existing, data);
    return this.projectRepo.save(merged);
  }

  async remove(id: number): Promise<void> {
    await this.projectRepo.delete(id);
  }
}
