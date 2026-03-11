import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Article } from './article.entity';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  getArticles(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Get(':id')
  getArticle(@Param('id', ParseIntPipe) id: number): Promise<Article> {
    return this.articlesService.getOrFail(id);
  }

  @Post()
  createArticle(@Body() data: Partial<Article>): Promise<Article> {
    return this.articlesService.create(data);
  }

  @Put(':id')
  updateArticle(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Article>,
  ): Promise<Article> {
    return this.articlesService.update(id, data);
  }

  @Delete(':id')
  deleteArticle(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.articlesService.remove(id);
  }
}
