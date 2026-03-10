import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: (process.env.DB_TYPE as 'mysql' | 'postgres') ?? 'mysql',
        host: process.env.DB_HOST ?? 'localhost',
        port: parseInt(
          process.env.DB_PORT ??
            (process.env.DB_TYPE === 'postgres' ? '5432' : '3306'),
          10,
        ),
        username: process.env.DB_USER ?? 'root',
        password: process.env.DB_PASS ?? '',
        database: process.env.DB_NAME ?? 'personal_website',
        autoLoadEntities: true,
        synchronize: true,
      }),
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
