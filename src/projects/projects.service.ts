import { Injectable, NotFoundException } from '@nestjs/common';

// Mock data for projects
const mockProjects = [
  {
    id: 1,
    title: 'Hooinn',
    routeId: 'hooinn',
    summary: 'Hooinn（呼应）是一款聚焦于进出口物流服务的 UGC 平台，为用户提供内容分享与交流服务...',
    content: 'Hooinn（呼应）是一款聚焦于进出口物流服务的 UGC 平台，为用户提供内容分享与交流服务，连接全球物流从业者，打造专业的物流知识社区。',
    coverUrl: '',
    tags: ['UI/UX设计', '移动端', 'Web端', 'B2B'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    title: 'PUB',
    routeId: 'pub',
    summary: 'PUB（发行系统）是一款聚焦于进出口物流服务的 UGC 平台，为用户提供内容分发与管理服务...',
    content: 'PUB（发行系统）是一款聚焦于进出口物流服务的内容分发与管理系统，为企业提供高效的内容管理、审核和分发能力。',
    coverUrl: '',
    tags: ['后台系统', '数据可视化', '工作流', '企业级'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 3,
    title: '武侯服务',
    routeId: 'wuhou-service',
    summary: '成都ezc平台是为了解决公安与政府之间地名地址与信息同步问题而构建的统一服务平台...',
    content: '成都ezc平台是为了解决公安与政府之间地名地址与信息同步问题而构建的统一服务平台。',
    coverUrl: '',
    tags: ['政务系统', 'GIS', '数据同步', 'B2G'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: 4,
    title: '数字堆场',
    routeId: 'digital-yard',
    summary: '成都ezc平台是为了解决公安与政府之间地名地址与信息同步问题而构建的统一服务平台...',
    content: '智慧堆场管理系统，通过数字化手段实现堆场资源的高效调度和可视化管理。',
    coverUrl: '',
    tags: ['智慧物流', '3D可视化', 'IoT', '大屏设计'],
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01'),
  },
];

@Injectable()
export class ProjectsService {
  findAll(): Promise<any[]> {
    return Promise.resolve(mockProjects);
  }

  findOne(id: number): Promise<any | null> {
    const project = mockProjects.find(p => p.id === id);
    return Promise.resolve(project || null);
  }

  async getOrFail(id: number): Promise<any> {
    const found = await this.findOne(id);
    if (!found) {
      throw new NotFoundException('Project not found');
    }
    return found;
  }

  create(data: any): Promise<any> {
    const newProject = {
      id: mockProjects.length + 1,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockProjects.push(newProject);
    return Promise.resolve(newProject);
  }

  async update(id: number, data: any): Promise<any> {
    const existing = await this.getOrFail(id);
    const index = mockProjects.findIndex(p => p.id === id);
    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    mockProjects[index] = updated;
    return Promise.resolve(updated);
  }

  async remove(id: number): Promise<void> {
    const index = mockProjects.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProjects.splice(index, 1);
    }
  }
}
