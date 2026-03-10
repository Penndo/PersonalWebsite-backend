import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TabConfig } from './tab-config.entity';

@Injectable()
export class TabsService {
  constructor(
    @InjectRepository(TabConfig)
    private readonly tabsRepo: Repository<TabConfig>,
  ) {}

  findAll(): Promise<TabConfig[]> {
    return this.tabsRepo.find({
      where: { enabled: true },
      order: { order: 'ASC' },
    });
  }

  async saveAll(tabs: TabConfig[]): Promise<TabConfig[]> {
    await this.tabsRepo.clear();
    return this.tabsRepo.save(tabs);
  }
}
