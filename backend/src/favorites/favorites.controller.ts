import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  async addFavorite(
    @Body('userId') userId: string,
    @Body('owner') owner: string,
    @Body('repo') repo: string,
  ) {
    return this.favoritesService.addFavorite(userId, owner, repo);
  }

  @Get(':userId')
  async getFavorites(@Param('userId') userId: string) {
    return this.favoritesService.getFavorites(userId);
  }

  @Delete(':id')
  async removeFavorite(@Param('id') id: string) {
    return this.favoritesService.removeFavorite(id);
  }
}