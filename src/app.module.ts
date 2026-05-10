import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

/** Always `backend/` (works whether the process cwd is repo root or `backend/`) */
const backendRoot = join(__dirname, '..');

function backendEnvFilePaths(): string[] {
  const isProduction =
    (process.env.NODE_ENV ?? 'development').toLowerCase() === 'production';
  const paths = [join(backendRoot, '.env')];
  if (!isProduction) {
    paths.push(
      join(backendRoot, '.env.development.local'),
      join(backendRoot, '.env.local'),
    );
  }
  return paths;
}
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TabsModule } from './tabs/tabs.module';
import { ProjectsModule } from './projects/projects.module';
import { ArticlesModule } from './articles/articles.module';
import { PluginsModule } from './plugins/plugins.module';
import { UploadModule } from './upload/upload.module';
import { RecommendationModule } from './recommendations/recommendation.module';
import { AuthModule } from './auth/auth.module';
import { UserProfile } from './user/user-profile.entity';
import { TabConfig } from './tabs/tab-config.entity';
import { Project } from './projects/project.entity';
import { Article } from './articles/article.entity';
import { Plugin } from './plugins/plugin.entity';
import { Recommendation } from './recommendations/recommendation.entity';
import { AdminCredential } from './auth/admin-credential.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: backendEnvFilePaths(),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';
        const dbType = configService.get<string>('DB_TYPE') ?? 'mysql';

        if (dbType === 'postgres') {
          return {
            type: 'postgres',
            host: configService.get<string>('DB_HOST') ?? 'localhost',
            port: parseInt(configService.get<string>('DB_PORT') ?? '5432', 10),
            username: configService.get<string>('DB_USER') ?? 'postgres',
            password: configService.get<string>('DB_PASS') ?? '',
            database:
              configService.get<string>('DB_NAME') ?? 'personal_website',
            entities: [
              UserProfile,
              TabConfig,
              Project,
              Article,
              Plugin,
              Recommendation,
              AdminCredential,
            ],
            synchronize: nodeEnv !== 'production',
          } satisfies TypeOrmModuleOptions;
        }

        return {
          type: 'mysql',
          host: configService.get<string>('DB_HOST') ?? 'localhost',
          port: parseInt(configService.get<string>('DB_PORT') ?? '3306', 10),
          username: configService.get<string>('DB_USER') ?? 'root',
          password: configService.get<string>('DB_PASS') ?? '',
          database: configService.get<string>('DB_NAME') ?? 'personal_website',
          entities: [
            UserProfile,
            TabConfig,
            Project,
            Article,
            Plugin,
            Recommendation,
            AdminCredential,
          ],
          synchronize: nodeEnv !== 'production',
        } satisfies TypeOrmModuleOptions;
      },
    }),
    UserModule,
    TabsModule,
    ProjectsModule,
    ArticlesModule,
    PluginsModule,
    UploadModule,
    RecommendationModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
