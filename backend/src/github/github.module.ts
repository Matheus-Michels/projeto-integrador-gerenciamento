import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { SearchHistory } from '../entities/search-history.entity';
import { User } from '../entities/user.entity'; // <-- Importe o User

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([SearchHistory, User]) // <-- Adicione o User aqui
  ],
  controllers: [GithubController],
  providers: [GithubService],
})
export class GithubModule {}