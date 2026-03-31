import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recommendation } from './recommendation.entity';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(Recommendation)
    private recommendationRepository: Repository<Recommendation>,
  ) {}

  async findAll(): Promise<Recommendation[]> {
    return this.recommendationRepository.find({ order: { order: 'ASC' } });
  }

  async create(recommendation: Partial<Recommendation>): Promise<Recommendation> {
    const newRecommendation = this.recommendationRepository.create(recommendation);
    return this.recommendationRepository.save(newRecommendation);
  }

  async update(id: number, recommendation: Partial<Recommendation>): Promise<Recommendation> {
    const existingRecommendation = await this.recommendationRepository.findOneBy({ id });
    if (!existingRecommendation) {
      throw new NotFoundException('Recommendation not found');
    }
    Object.assign(existingRecommendation, recommendation);
    return this.recommendationRepository.save(existingRecommendation);
  }

  async delete(id: number): Promise<void> {
    const result = await this.recommendationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Recommendation not found');
    }
  }

  async deleteAll(): Promise<void> {
    await this.recommendationRepository.clear();
  }

  async saveMultiple(recommendations: Partial<Recommendation>[]): Promise<Recommendation[]> {
    // 先删除所有现有推荐
    await this.deleteAll();
    // 保存新的推荐
    const newRecommendations = recommendations.map((rec, index) => {
      return this.recommendationRepository.create({
        ...rec,
        order: index + 1,
      });
    });
    return this.recommendationRepository.save(newRecommendations);
  }
}
