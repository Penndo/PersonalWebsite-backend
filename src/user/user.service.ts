import { Injectable } from '@nestjs/common';

// Mock data for user profile
const mockUserProfile = {
  id: 1,
  displayName: 'Yeatfish',
  introTitle: 'UI/UX/PM',
  introContent: '这是一位拥有 10 年 UI/UX 设计工作经验与、2 年产品经理工作经验，兼具专业设计能力与产品思维的复合型牛马；他的复合色包括"用户同理心"、"商业判断力"、"高级的审美与品味"，助力产品在 AI 潮流中急速破浪。',
  avatarUrl: '',
  logoUrl: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

@Injectable()
export class UserService {
  async getProfile(): Promise<any> {
    return Promise.resolve(mockUserProfile);
  }

  async upsertProfile(payload: any): Promise<any> {
    Object.assign(mockUserProfile, payload);
    mockUserProfile.updatedAt = new Date();
    return Promise.resolve(mockUserProfile);
  }
}
