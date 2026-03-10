import { Injectable, NotFoundException } from '@nestjs/common';

// Mock data for plugins
const mockPlugins = [
  {
    id: 1,
    title: 'Figma Design Token Generator',
    routeId: 'figma-token-generator',
    summary: '自动从Figma设计文件生成设计令牌的工具插件...',
    content: '自动从Figma设计文件生成设计令牌的工具插件，支持导出为CSS、JSON、SCSS等多种格式...',
    repositoryUrl: '',
    downloadUrl: '',
    version: '2.1.0',
    tags: ['设计令牌', 'Figma插件', '开发工具', '设计系统'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    title: 'Color Palette Creator',
    routeId: 'color-palette-creator',
    summary: '快速创建和管理配色方案的Figma插件...',
    content: '快速创建和管理配色方案的Figma插件，提供智能配色建议和色彩和谐工具...',
    repositoryUrl: '',
    downloadUrl: '',
    version: '1.5.2',
    tags: ['配色工具', 'Figma插件', '色彩理论', '设计辅助'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 3,
    title: 'Icon Manager',
    routeId: 'icon-manager',
    summary: '图标管理和导出工具，支持多种格式和尺寸...',
    content: '图标管理和导出工具，支持多种格式和尺寸，帮助设计师高效管理图标资源...',
    repositoryUrl: '',
    downloadUrl: '',
    version: '3.0.1',
    tags: ['图标管理', 'Figma插件', '资源管理', '导出工具'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
];

@Injectable()
export class PluginsService {
  findAll(): Promise<any[]> {
    return Promise.resolve(mockPlugins);
  }

  findOne(id: number): Promise<any | null> {
    const plugin = mockPlugins.find(p => p.id === id);
    return Promise.resolve(plugin || null);
  }

  async getOrFail(id: number): Promise<any> {
    const found = await this.findOne(id);
    if (!found) {
      throw new NotFoundException('Plugin not found');
    }
    return found;
  }

  create(data: any): Promise<any> {
    const newPlugin = {
      id: mockPlugins.length + 1,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockPlugins.push(newPlugin);
    return Promise.resolve(newPlugin);
  }

  async update(id: number, data: any): Promise<any> {
    const existing = await this.getOrFail(id);
    const index = mockPlugins.findIndex(p => p.id === id);
    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    mockPlugins[index] = updated;
    return Promise.resolve(updated);
  }

  async remove(id: number): Promise<void> {
    const index = mockPlugins.findIndex(p => p.id === id);
    if (index !== -1) {
      mockPlugins.splice(index, 1);
    }
  }
}
