import { Body, Controller, Get, Put } from '@nestjs/common';
import { TabConfig } from './tab-config.entity';
import { TabsService } from './tabs.service';

@Controller('tabs')
export class TabsController {
  constructor(private readonly tabsService: TabsService) {}

  @Get()
  getTabs(): Promise<TabConfig[]> {
    return this.tabsService.findAll();
  }

  @Put()
  updateTabs(@Body() tabs: TabConfig[]): Promise<TabConfig[]> {
    return this.tabsService.saveAll(tabs);
  }
}
