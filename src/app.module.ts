import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TabsModule } from './tabs/tabs.module';
import { ProjectsModule } from './projects/projects.module';
import { ArticlesModule } from './articles/articles.module';
import { PluginsModule } from './plugins/plugins.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    TabsModule,
    ProjectsModule,
    ArticlesModule,
    PluginsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
