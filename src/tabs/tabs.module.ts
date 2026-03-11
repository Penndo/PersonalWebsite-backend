import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TabConfig } from './tab-config.entity';
import { TabsController } from './tabs.controller';
import { TabsService } from './tabs.service';

@Module({
  imports: [TypeOrmModule.forFeature([TabConfig])],
  controllers: [TabsController],
  providers: [TabsService],
})
export class TabsModule {}
