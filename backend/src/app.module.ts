import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { SearchHistory } from './entities/search-history.entity';
import { GithubModule } from './github/github.module';
import { AuthModule } from './auth/auth.module';
import { FavoriteRepository } from './entities/favorite-repository.entity';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'gerenciamento_atividades',
      entities: [User, SearchHistory, FavoriteRepository],
      autoLoadEntities: true,
      synchronize: true,
    }),
    GithubModule,
    AuthModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}