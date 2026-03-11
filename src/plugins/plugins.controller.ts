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
import { Plugin } from './plugin.entity';
import { PluginsService } from './plugins.service';

@Controller('plugins')
export class PluginsController {
  constructor(private readonly pluginsService: PluginsService) {}

  @Get()
  getPlugins(): Promise<Plugin[]> {
    return this.pluginsService.findAll();
  }

  @Get(':id')
  getPlugin(@Param('id', ParseIntPipe) id: number): Promise<Plugin> {
    return this.pluginsService.getOrFail(id);
  }

  @Post()
  createPlugin(@Body() data: Partial<Plugin>): Promise<Plugin> {
    return this.pluginsService.create(data);
  }

  @Put(':id')
  updatePlugin(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Plugin>,
  ): Promise<Plugin> {
    return this.pluginsService.update(id, data);
  }

  @Delete(':id')
  deletePlugin(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.pluginsService.remove(id);
  }
}
