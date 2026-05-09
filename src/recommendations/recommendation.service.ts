import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Recommendation } from './recommendation.entity';

const VALID_ITEM_TYPES = ['project', 'article', 'plugin'];

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(Recommendation)
    private recommendationRepository: Repository<Recommendation>,
    private dataSource: DataSource,
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
    await this.recommendationRepository.createQueryBuilder().delete().execute();
  }

  async saveMultiple(recommendations: Partial<Recommendation>[]): Promise<Recommendation[]> {
    if (!Array.isArray(recommendations)) {
      throw new BadRequestException('请求数据格式错误，应为数组');
    }

    for (let i = 0; i < recommendations.length; i++) {
      const rec = recommendations[i];
      if (!rec.itemId || !rec.title || !rec.itemType) {
        throw new BadRequestException(
          `第 ${i + 1} 项推荐缺少必填字段（itemId、title、itemType）`,
        );
      }
      if (!VALID_ITEM_TYPES.includes(rec.itemType)) {
        throw new BadRequestException(
          `第 ${i + 1} 项推荐的 itemType 无效："${rec.itemType}"，应为 project/article/plugin`,
        );
      }
    }

    try {
      return await this.dataSource.transaction(async (manager) => {
        await manager.createQueryBuilder().delete().from(Recommendation).execute();
        const newRecommendations = recommendations.map((rec, index) =>
          manager.create(Recommendation, {
            ...rec,
            order: index + 1,
          }),
        );
        return manager.save(newRecommendations);
      });
    } catch (error) {
      console.error('保存推荐内容失败:', error);
      throw error;
    }
  }
}
