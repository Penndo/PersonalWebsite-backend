import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plugin } from './plugin.entity';

@Injectable()
export class PluginsService {
  constructor(
    @InjectRepository(Plugin)
    private readonly pluginRepo: Repository<Plugin>,
  ) {}

  findAll(): Promise<Plugin[]> {
    return this.pluginRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number): Promise<Plugin | null> {
    return this.pluginRepo.findOne({ where: { id } });
  }

  async getOrFail(id: number): Promise<Plugin> {
    const found = await this.findOne(id);
    if (!found) {
      throw new NotFoundException('Plugin not found');
    }
    return found;
  }

  create(data: Partial<Plugin>): Promise<Plugin> {
    const entity = this.pluginRepo.create(data);
    return this.pluginRepo.save(entity);
  }

  async update(id: number, data: Partial<Plugin>): Promise<Plugin> {
    const existing = await this.getOrFail(id);
    const merged = this.pluginRepo.merge(existing, data);
    return this.pluginRepo.save(merged);
  }

  async remove(id: number): Promise<void> {
    await this.pluginRepo.delete(id);
  }
}
