import { Injectable } from '@nestjs/common';

// Mock data for tabs
const mockTabs = [
  { id: 1, key: 'projects', label: '作品', order: 1, enabled: true },
  { id: 2, key: 'articles', label: '文章', order: 2, enabled: true },
  { id: 3, key: 'plugins', label: '插件', order: 3, enabled: true },
];

@Injectable()
export class TabsService {
  findAll(): Promise<any[]> {
    return Promise.resolve(mockTabs.filter(tab => tab.enabled));
  }

  async saveAll(tabs: any[]): Promise<any[]> {
    mockTabs.length = 0;
    tabs.forEach((tab, index) => {
      mockTabs.push({
        id: index + 1,
        ...tab,
      });
    });
    return Promise.resolve(mockTabs);
  }
}
