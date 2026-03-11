import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plugin } from './plugin.entity';

@Injectable()
export class PluginsService {
  constructor(
    @InjectRepository(Plugin)
    private readonly pluginRepository: Repository<Plugin>,
  ) {}

  findAll(): Promise<Plugin[]> {
    return this.pluginRepository.find({
      order: { id: 'ASC' },
    });
  }

  async getOrFail(id: number): Promise<Plugin> {
    const found = await this.pluginRepository.findOne({ where: { id } });
    if (found === null) {
      throw new NotFoundException('Plugin not found');
    }
    return found;
  }

  create(data: Partial<Plugin>): Promise<Plugin> {
    const entity = this.pluginRepository.create({
      title: data.title ?? '',
      routeId: data.routeId ?? `plugin-${Date.now()}`,
      summary: data.summary ?? '',
      content: data.content ?? null,
      coverUrl: data.coverUrl ?? null,
      repositoryUrl: data.repositoryUrl ?? null,
      downloadUrl: data.downloadUrl ?? null,
      version: data.version ?? null,
      tags: data.tags ?? null,
    });
    return this.pluginRepository.save(entity);
  }

  async update(id: number, data: Partial<Plugin>): Promise<Plugin> {
    const existing = await this.getOrFail(id);
    const merged = this.pluginRepository.merge(existing, data);
    return this.pluginRepository.save(merged);
  }

  async remove(id: number): Promise<void> {
    await this.pluginRepository.delete({ id });
  }
}
