import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TabsController } from './tabs.controller';
import { TabsService } from './tabs.service';
import { TabConfig } from './tab-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TabConfig])],
  controllers: [TabsController],
  providers: [TabsService],
})
export class TabsModule {}
