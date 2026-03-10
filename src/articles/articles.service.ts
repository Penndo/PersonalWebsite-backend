import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {}

  findAll(): Promise<Article[]> {
    return this.articleRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number): Promise<Article | null> {
    return this.articleRepo.findOne({ where: { id } });
  }

  async getOrFail(id: number): Promise<Article> {
    const found = await this.findOne(id);
    if (!found) {
      throw new NotFoundException('Article not found');
    }
    return found;
  }

  create(data: Partial<Article>): Promise<Article> {
    const entity = this.articleRepo.create(data);
    return this.articleRepo.save(entity);
  }

  async update(id: number, data: Partial<Article>): Promise<Article> {
    const existing = await this.getOrFail(id);
    const merged = this.articleRepo.merge(existing, data);
    return this.articleRepo.save(merged);
  }

  async remove(id: number): Promise<void> {
    await this.articleRepo.delete(id);
  }
}
