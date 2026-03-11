import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  findAll(): Promise<Article[]> {
    return this.articleRepository.find({
      order: { id: 'ASC' },
    });
  }

  async getOrFail(id: number): Promise<Article> {
    const found = await this.articleRepository.findOne({ where: { id } });
    if (found === null) {
      throw new NotFoundException('Article not found');
    }
    return found;
  }

  create(data: Partial<Article>): Promise<Article> {
    const entity = this.articleRepository.create({
      title: data.title ?? '',
      routeId: data.routeId ?? `article-${Date.now()}`,
      summary: data.summary ?? '',
      content: data.content ?? null,
      coverUrl: data.coverUrl ?? null,
      tags: data.tags ?? null,
    });
    return this.articleRepository.save(entity);
  }

  async update(id: number, data: Partial<Article>): Promise<Article> {
    const existing = await this.getOrFail(id);
    const merged = this.articleRepository.merge(existing, data);
    return this.articleRepository.save(merged);
  }

  async remove(id: number): Promise<void> {
    await this.articleRepository.delete({ id });
  }
}
