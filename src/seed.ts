import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { UserProfile } from './user/user-profile.entity';
import { TabConfig } from './tabs/tab-config.entity';
import { Project } from './projects/project.entity';
import { Article } from './articles/article.entity';
import { Plugin } from './plugins/plugin.entity';

config();

const dataSource = new DataSource({
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
  entities: [UserProfile, TabConfig, Project, Article, Plugin],
  synchronize: true,
});

async function seed(): Promise<void> {
  await dataSource.initialize();

  const userRepo = dataSource.getRepository(UserProfile);
  const tabRepo = dataSource.getRepository(TabConfig);
  const projectRepo = dataSource.getRepository(Project);
  const articleRepo = dataSource.getRepository(Article);
  const pluginRepo = dataSource.getRepository(Plugin);

  const existingUser = await userRepo.findOne({ where: { id: 1 } });
  if (!existingUser) {
    const profile = userRepo.create({
      displayName: 'Your Name',
      introTitle: '前端工程师 / 全栈开发者',
      introContent:
        '这里是个人简介示例，你可以在后台或数据库中修改为自己的介绍内容。',
      avatarUrl: '',
      logoUrl: '',
    });
    await userRepo.save(profile);
  }

  const existingTabs = await tabRepo.count();
  if (existingTabs === 0) {
    const tabs = tabRepo.create([
      { key: 'projects', label: '作品', order: 1, enabled: true },
      { key: 'articles', label: '文章', order: 2, enabled: true },
      { key: 'plugins', label: '插件', order: 3, enabled: true },
    ]);
    await tabRepo.save(tabs);
  }

  const projectCount = await projectRepo.count();
  if (projectCount === 0) {
    const projects = projectRepo.create([
      {
        title: '个人网站',
        routeId: 'personal-website',
        summary: '基于 React 和 NestJS 的个人网站项目。',
        content:
          '这里是作品详情的示例内容，你可以在后台或数据库中修改为自己的项目介绍。',
        coverUrl: '',
        tags: ['frontend', 'react', 'nest'],
      },
    ]);
    await projectRepo.save(projects);
  }

  const articleCount = await articleRepo.count();
  if (articleCount === 0) {
    const articles = articleRepo.create([
      {
        title: '如何搭建现代化个人网站',
        routeId: 'build-modern-personal-site',
        summary: '介绍使用 React + Vite + NestJS 搭建个人网站的经验。',
        content:
          '这里是文章详情示例内容，你可以用 Markdown 文本替换为真实博客文章。',
        coverUrl: '',
        tags: ['blog', 'frontend'],
      },
    ]);
    await articleRepo.save(articles);
  }

  const pluginCount = await pluginRepo.count();
  if (pluginCount === 0) {
    const plugins = pluginRepo.create([
      {
        title: 'VSCode 个人主题',
        routeId: 'vscode-theme',
        summary: '一款为开发者设计的 VSCode 主题插件。',
        content:
          '这里是插件详情示例内容，可以放上安装说明、特性介绍等。',
        repositoryUrl: '',
        downloadUrl: '',
        version: '1.0.0',
        tags: ['vscode', 'plugin'],
      },
    ]);
    await pluginRepo.save(plugins);
  }

  // eslint-disable-next-line no-console
  console.log('Seed completed');
  await dataSource.destroy();
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

