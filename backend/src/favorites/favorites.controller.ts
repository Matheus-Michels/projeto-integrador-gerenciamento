import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  async addFavorite(
    @Req() req: any,
    @Body('owner') owner: string,
    @Body('repo') repo: string,
  ) {
    const userId = req.session.getUserId();
    return this.favoritesService.addFavorite(userId, owner, repo);
  }

  @Get()
  async getFavorites(@Req() req: any) {
    const userId = req.session.getUserId();
    return this.favoritesService.getFavorites(userId);
  }

  @Delete(':owner/:repo')
  async removeFavoriteByRepo(
    @Req() req: any,
    @Param('owner') owner: string,
    @Param('repo') repo: string,
  ) {
    const userId = req.session.getUserId();
    return this.favoritesService.removeFavoriteByRepo(userId, owner, repo);
  }
}