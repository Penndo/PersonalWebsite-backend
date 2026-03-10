import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './user-profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userRepo: Repository<UserProfile>,
  ) {}

  async getProfile(): Promise<UserProfile | null> {
    const all = await this.userRepo.find({ take: 1 });
    return all[0] ?? null;
  }

  async upsertProfile(
    payload: Partial<UserProfile>,
  ): Promise<UserProfile> {
    const existing = await this.getProfile();
    if (!existing) {
      const created = this.userRepo.create(payload);
      return this.userRepo.save(created);
    }
    const merged = this.userRepo.merge(existing, payload);
    return this.userRepo.save(merged);
  }
}
