import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { SearchHistory } from '../entities/search-history.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class GithubService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(SearchHistory)
    private searchHistoryRepo: Repository<SearchHistory>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getRepository(owner: string, repo: string) {
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      throw new HttpException('Erro ao buscar o repositório.', HttpStatus.BAD_REQUEST);
    }
  }

  async getCommits(owner: string, repo: string, since?: string, until?: string) {
    try {
      let user = await this.userRepo.createQueryBuilder().getOne();
      if (!user) {
        user = this.userRepo.create({ name: 'Usuário Teste', email: 'teste@teste.com' });
        await this.userRepo.save(user);
      }

      const history = this.searchHistoryRepo.create({ owner, repo, user });
      await this.searchHistoryRepo.save(history);
    } catch (err) {
      console.error('Falha ao registrar histórico de busca no banco', err);
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/commits`;
    try {
      const response = await firstValueFrom(this.httpService.get(url, {
        params: { since, until }
      }));
      return response.data;
    } catch (error) {
      throw new HttpException('Erro ao buscar commits.', HttpStatus.BAD_REQUEST);
    }
  }

  async getPullRequests(owner: string, repo: string) {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls`;
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      throw new HttpException('Erro ao buscar Pull Requests.', HttpStatus.BAD_REQUEST);
    }
  }

  async getIssues(owner: string, repo: string, since?: string) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues`;
    try {
      const response = await firstValueFrom(this.httpService.get(url, {
        params: { since }
      }));
      return response.data;
    } catch (error) {
      throw new HttpException('Erro ao buscar Issues.', HttpStatus.BAD_REQUEST);
    }
  }
}