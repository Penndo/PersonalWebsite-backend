import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TabConfig } from './tab-config.entity';

@Injectable()
export class TabsService {
  constructor(
    @InjectRepository(TabConfig)
    private readonly tabConfigRepository: Repository<TabConfig>,
  ) {}

  findAll(): Promise<TabConfig[]> {
    return this.tabConfigRepository.find({
      where: { enabled: true },
      order: { order: 'ASC' },
    });
  }

  async saveAll(tabs: TabConfig[]): Promise<TabConfig[]> {
    await this.tabConfigRepository.clear();
    const created = tabs.map((tab, index) =>
      this.tabConfigRepository.create({
        key: tab.key,
        label: tab.label,
        order: tab.order ?? index,
        enabled: tab.enabled ?? true,
      }),
    );
    return this.tabConfigRepository.save(created);
  }
}
