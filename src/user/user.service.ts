import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './user-profile.entity';

export interface UserInfoDto {
  name: string;
  profession: string;
  age: number;
  hobbies: string[];
  avatar: string;
  introduction: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  async getProfile(): Promise<UserInfoDto> {
    let profile = await this.userProfileRepository.findOne({
      where: { id: 1 },
    });

    if (!profile) {
      profile = this.userProfileRepository.create({
        displayName: 'Yeatfish',
        introTitle: 'UI/UX/PM',
        introContent:
          '这是一位拥有 10 年 UI/UX 设计工作经验与、2 年产品经理工作经验，兼具专业设计能力与产品思维的复合型牛马；他的复合色包括"用户同理心"、"商业判断力"、"高级的审美与品味"，助力产品在 AI 潮流中急速破浪。',
        avatarUrl: '',
        logoUrl: '',
        age: 34,
        hobbies: ['篮球'],
      });
      profile = await this.userProfileRepository.save(profile);
    }

    return {
      name: profile.displayName,
      profession: profile.introTitle ?? '',
      age: profile.age,
      hobbies: profile.hobbies ?? [],
      avatar: profile.avatarUrl ?? '',
      introduction: profile.introContent ?? '',
    };
  }

  async upsertProfile(payload: Partial<UserInfoDto>): Promise<UserInfoDto> {
    const existing =
      (await this.userProfileRepository.findOne({
        where: { id: 1 },
      })) ??
      this.userProfileRepository.create({
        id: 1,
        displayName: 'Yeatfish',
        introTitle: '',
        introContent: '',
        avatarUrl: '',
        logoUrl: '',
        age: 0,
        hobbies: [],
      });

    if (payload.name !== undefined) existing.displayName = payload.name;
    if (payload.profession !== undefined)
      existing.introTitle = payload.profession;
    if (payload.introduction !== undefined)
      existing.introContent = payload.introduction;
    if (payload.avatar !== undefined) existing.avatarUrl = payload.avatar;
    if (typeof payload.age === 'number') existing.age = payload.age;
    if (Array.isArray(payload.hobbies)) existing.hobbies = payload.hobbies;

    const saved = await this.userProfileRepository.save(existing);
    return {
      name: saved.displayName,
      profession: saved.introTitle ?? '',
      age: saved.age,
      hobbies: saved.hobbies ?? [],
      avatar: saved.avatarUrl ?? '',
      introduction: saved.introContent ?? '',
    };
  }
}
