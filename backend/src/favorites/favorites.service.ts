import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteRepository } from '../entities/favorite-repository.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteRepository)
    private favoriteRepo: Repository<FavoriteRepository>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async addFavorite(userId: string, owner: string, repo: string) {
    let user = await this.userRepo.createQueryBuilder().getOne();
    if (!user) {
      user = this.userRepo.create({ name: 'Usuário Teste', email: 'teste@teste.com' });
      await this.userRepo.save(user);
    }

    const existingFavorite = await this.favoriteRepo.findOne({
      where: { owner, repo, user: { id: user.id } },
    });

    if (existingFavorite) {
      throw new ConflictException('Este repositório já foi favoritado.');
    }

    const favorite = this.favoriteRepo.create({ owner, repo, user });
    return this.favoriteRepo.save(favorite);
  }

  async getFavorites(userId: string) {
    const user = await this.userRepo.createQueryBuilder().getOne();
    if (!user) return [];

    return this.favoriteRepo.find({
      where: { user: { id: user.id } },
      order: { savedAt: 'DESC' },
    });
  }

  async removeFavorite(id: string) {
    await this.favoriteRepo.delete(id);
  }
}