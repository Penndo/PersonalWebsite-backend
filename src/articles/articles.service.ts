import { Injectable, NotFoundException } from '@nestjs/common';

// Mock data for articles
const mockArticles = [
  {
    id: 1,
    title: '设计系统构建指南',
    routeId: 'design-system-guide',
    summary: '如何从零开始构建一套完整的设计系统，包括设计语言、组件库和文档规范...',
    content: '如何从零开始构建一套完整的设计系统，包括设计语言、组件库和文档规范...',
    coverUrl: '',
    tags: ['设计系统', 'UI设计', '组件库', '设计规范'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    title: '用户体验设计方法论',
    routeId: 'ux-design-methodology',
    summary: '深入探讨用户体验设计的核心方法论，从用户研究到设计验证的完整流程...',
    content: '深入探讨用户体验设计的核心方法论，从用户研究到设计验证的完整流程...',
    coverUrl: '',
    tags: ['用户体验', '设计方法', '用户研究', '设计验证'],
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: 3,
    title: '产品思维与设计思维',
    routeId: 'product-design-thinking',
    summary: '产品思维与设计思维的区别与融合，如何在项目中平衡商业目标与用户需求...',
    content: '产品思维与设计思维的区别与融合，如何在项目中平衡商业目标与用户需求...',
    coverUrl: '',
    tags: ['产品思维', '设计思维', '商业目标', '用户需求'],
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: 4,
    title: 'AI时代的设计趋势',
    routeId: 'ai-design-trends',
    summary: '探讨人工智能时代下设计师需要掌握的新技能和面临的机遇与挑战...',
    content: '探讨人工智能时代下设计师需要掌握的新技能和面临的机遇与挑战...',
    coverUrl: '',
    tags: ['人工智能', '设计趋势', 'AI设计', '未来设计'],
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-05'),
  },
  {
    id: 5,
    title: '移动端交互设计最佳实践',
    routeId: 'mobile-ux-best-practices',
    summary: '移动端应用交互设计的最佳实践，包括手势设计、动效设计和用户体验优化...',
    content: '移动端应用交互设计的最佳实践，包括手势设计、动效设计和用户体验优化...',
    coverUrl: '',
    tags: ['移动端', '交互设计', '手势设计', '动效设计'],
    createdAt: new Date('2024-05-18'),
    updatedAt: new Date('2024-05-18'),
  },
];

@Injectable()
export class ArticlesService {
  findAll(): Promise<any[]> {
    return Promise.resolve(mockArticles);
  }

  findOne(id: number): Promise<any | null> {
    const article = mockArticles.find(a => a.id === id);
    return Promise.resolve(article || null);
  }

  async getOrFail(id: number): Promise<any> {
    const found = await this.findOne(id);
    if (!found) {
      throw new NotFoundException('Article not found');
    }
    return found;
  }

  create(data: any): Promise<any> {
    const newArticle = {
      id: mockArticles.length + 1,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockArticles.push(newArticle);
    return Promise.resolve(newArticle);
  }

  async update(id: number, data: any): Promise<any> {
    const existing = await this.getOrFail(id);
    const index = mockArticles.findIndex(a => a.id === id);
    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    mockArticles[index] = updated;
    return Promise.resolve(updated);
  }

  async remove(id: number): Promise<void> {
    const index = mockArticles.findIndex(a => a.id === id);
    if (index !== -1) {
      mockArticles.splice(index, 1);
    }
  }
}
