import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASS', 'root'),
        database: configService.get<string>('DB_NAME', 'gerenciamento_atividades'),
        entities: [User, SearchHistory, FavoriteRepository],
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    AuthModule,
    GithubModule,
    FavoritesModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, SupertokensService],
})
export class AppModule {}