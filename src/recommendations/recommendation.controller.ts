import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { Recommendation } from './recommendation.entity';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get()
  async findAll(): Promise<Recommendation[]> {
    return this.recommendationService.findAll();
  }

  @Post()
  async create(@Body() recommendation: Partial<Recommendation>): Promise<Recommendation> {
    return this.recommendationService.create(recommendation);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() recommendation: Partial<Recommendation>,
  ): Promise<Recommendation> {
    return this.recommendationService.update(id, recommendation);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.recommendationService.delete(id);
  }

  @Post('batch')
  async saveMultiple(@Body() recommendations: Partial<Recommendation>[]): Promise<Recommendation[]> {
    return this.recommendationService.saveMultiple(recommendations);
  }
}
