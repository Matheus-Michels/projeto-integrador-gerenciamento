import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { SearchHistory } from '../entities/search-history.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class GithubService {
  private readonly headers = { 
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}` 
};

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
      const response = await firstValueFrom(this.httpService.get(url, { headers: this.headers }));
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
        headers: this.headers,
        params: { since, until }
      }));
      return response.data;
    } catch (error) {
      throw new HttpException('Erro ao buscar commits.', HttpStatus.BAD_REQUEST);
    }
  }

  async getPullRequests(owner: string, repo: string, since?: string, until?: string, author?: string) {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=100`;
    try {
      const response = await firstValueFrom(this.httpService.get(url, { headers: this.headers }));
      let data = response.data;

      if (since) {
        const sinceDate = new Date(since);
        data = data.filter((item: any) => new Date(item.created_at) >= sinceDate);
      }
      if (until) {
        const untilDate = new Date(`${until}T23:59:59Z`);
        data = data.filter((item: any) => new Date(item.created_at) <= untilDate);
      }
      if (author) {
        data = data.filter((item: any) => item.user?.login.toLowerCase() === author.toLowerCase());
      }

      return data;
    } catch (error) {
      throw new HttpException('Erro ao buscar Pull Requests.', HttpStatus.BAD_REQUEST);
    }
  }

  async getIssues(owner: string, repo: string, since?: string, until?: string, author?: string) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100`;
    try {
      const response = await firstValueFrom(this.httpService.get(url, { headers: this.headers }));
      let data = response.data;

      if (since) {
        const sinceDate = new Date(since);
        data = data.filter((item: any) => new Date(item.created_at) >= sinceDate);
      }
      if (until) {
        const untilDate = new Date(`${until}T23:59:59Z`);
        data = data.filter((item: any) => new Date(item.created_at) <= untilDate);
      }
      if (author) {
        data = data.filter((item: any) => item.user?.login.toLowerCase() === author.toLowerCase());
      }

      return data;
    } catch (error) {
      throw new HttpException('Erro ao buscar Issues.', HttpStatus.BAD_REQUEST);
    }
  }
}