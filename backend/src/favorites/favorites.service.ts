import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
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
    let user = await this.userRepo.findOneBy({ id: userId });
    
    if (!user) {
      user = this.userRepo.create({ id: userId, name: 'Usuário', email: `${userId}@supertokens.com` });
      await this.userRepo.save(user);
    }

    const existingFavorite = await this.favoriteRepo.findOne({
      where: { owner, repo, user: { id: userId } },
    });

    if (existingFavorite) {
      throw new ConflictException('Este repositório já foi favoritado.');
    }

    const favorite = this.favoriteRepo.create({ owner, repo, user });
    return this.favoriteRepo.save(favorite);
  }

  async getFavorites(userId: string) {
    return this.favoriteRepo.find({
      where: { user: { id: userId } },
      order: { savedAt: 'DESC' },
    });
  }

  async removeFavoriteByRepo(userId: string, owner: string, repo: string) {
    await this.favoriteRepo.delete({ owner, repo, user: { id: userId } });
  }
}