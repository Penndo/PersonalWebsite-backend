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
        title: 'Hooinn',
        routeId: 'hooinn',
        summary: 'Hooinn（呼应）是一款聚焦于进出口物流服务的 UGC 平台，为用户提供内容分享与交流服务...',
        content: 'Hooinn（呼应）是一款聚焦于进出口物流服务的 UGC 平台，为用户提供内容分享与交流服务，连接全球物流从业者，打造专业的物流知识社区。',
        coverUrl: '',
        tags: ['UI/UX设计', '移动端', 'Web端', 'B2B'],
      },
      {
        title: 'PUB',
        routeId: 'pub',
        summary: 'PUB（发行系统）是一款聚焦于进出口物流服务的 UGC 平台，为用户提供内容分发与管理服务...',
        content: 'PUB（发行系统）是一款聚焦于进出口物流服务的内容分发与管理系统，为企业提供高效的内容管理、审核和分发能力。',
        coverUrl: '',
        tags: ['后台系统', '数据可视化', '工作流', '企业级'],
      },
      {
        title: '武侯服务',
        routeId: 'wuhou-service',
        summary: '成都ezc平台是为了解决公安与政府之间地名地址与信息同步问题而构建的统一服务平台...',
        content: '成都ezc平台是为了解决公安与政府之间地名地址与信息同步问题而构建的统一服务平台。',
        coverUrl: '',
        tags: ['政务系统', 'GIS', '数据同步', 'B2G'],
      },
      {
        title: '数字堆场',
        routeId: 'digital-yard',
        summary: '成都ezc平台是为了解决公安与政府之间地名地址与信息同步问题而构建的统一服务平台...',
        content: '智慧堆场管理系统，通过数字化手段实现堆场资源的高效调度和可视化管理。',
        coverUrl: '',
        tags: ['智慧物流', '3D可视化', 'IoT', '大屏设计'],
      },
    ]);
    await projectRepo.save(projects);
  }

  const articleCount = await articleRepo.count();
  if (articleCount === 0) {
    const articles = articleRepo.create([
      {
        title: '设计系统构建指南',
        routeId: 'design-system-guide',
        summary: '如何从零开始构建一套完整的设计系统，包括设计语言、组件库和文档规范...',
        content: '如何从零开始构建一套完整的设计系统，包括设计语言、组件库和文档规范...',
        coverUrl: '',
        tags: ['设计系统', 'UI设计', '组件库', '设计规范'],
      },
      {
        title: '用户体验设计方法论',
        routeId: 'ux-design-methodology',
        summary: '深入探讨用户体验设计的核心方法论，从用户研究到设计验证的完整流程...',
        content: '深入探讨用户体验设计的核心方法论，从用户研究到设计验证的完整流程...',
        coverUrl: '',
        tags: ['用户体验', '设计方法', '用户研究', '设计验证'],
      },
      {
        title: '产品思维与设计思维',
        routeId: 'product-design-thinking',
        summary: '产品思维与设计思维的区别与融合，如何在项目中平衡商业目标与用户需求...',
        content: '产品思维与设计思维的区别与融合，如何在项目中平衡商业目标与用户需求...',
        coverUrl: '',
        tags: ['产品思维', '设计思维', '商业目标', '用户需求'],
      },
      {
        title: 'AI时代的设计趋势',
        routeId: 'ai-design-trends',
        summary: '探讨人工智能时代下设计师需要掌握的新技能和面临的机遇与挑战...',
        content: '探讨人工智能时代下设计师需要掌握的新技能和面临的机遇与挑战...',
        coverUrl: '',
        tags: ['人工智能', '设计趋势', 'AI设计', '未来设计'],
      },
      {
        title: '移动端交互设计最佳实践',
        routeId: 'mobile-ux-best-practices',
        summary: '移动端应用交互设计的最佳实践，包括手势设计、动效设计和用户体验优化...',
        content: '移动端应用交互设计的最佳实践，包括手势设计、动效设计和用户体验优化...',
        coverUrl: '',
        tags: ['移动端', '交互设计', '手势设计', '动效设计'],
      },
    ]);
    await articleRepo.save(articles);
  }

  const pluginCount = await pluginRepo.count();
  if (pluginCount === 0) {
    const plugins = pluginRepo.create([
      {
        title: 'Figma Design Token Generator',
        routeId: 'figma-token-generator',
        summary: '自动从Figma设计文件生成设计令牌的工具插件...',
        content: '自动从Figma设计文件生成设计令牌的工具插件，支持导出为CSS、JSON、SCSS等多种格式...',
        repositoryUrl: '',
        downloadUrl: '',
        version: '2.1.0',
        tags: ['设计令牌', 'Figma插件', '开发工具', '设计系统'],
      },
      {
        title: 'Color Palette Creator',
        routeId: 'color-palette-creator',
        summary: '快速创建和管理配色方案的Figma插件...',
        content: '快速创建和管理配色方案的Figma插件，提供智能配色建议和色彩和谐工具...',
        repositoryUrl: '',
        downloadUrl: '',
        version: '1.5.2',
        tags: ['配色工具', 'Figma插件', '色彩理论', '设计辅助'],
      },
      {
        title: 'Icon Manager',
        routeId: 'icon-manager',
        summary: '图标管理和导出工具，支持多种格式和尺寸...',
        content: '图标管理和导出工具，支持多种格式和尺寸，帮助设计师高效管理图标资源...',
        repositoryUrl: '',
        downloadUrl: '',
        version: '3.0.1',
        tags: ['图标管理', 'Figma插件', '资源管理', '导出工具'],
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

