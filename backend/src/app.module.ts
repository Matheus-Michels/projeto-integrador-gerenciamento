import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { SearchHistory } from './entities/search-history.entity';
import { FavoriteRepository } from './entities/favorite-repository.entity';
import { GithubModule } from './github/github.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AuthModule } from './auth/auth.module';
import { SupertokensService } from './auth/supertokens.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    AuthModule,
    GithubModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService, SupertokensService],
})
export class AppModule {}