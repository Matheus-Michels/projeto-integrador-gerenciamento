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

  // Função auxiliar para buscar o header dinamicamente no momento da requisição
  private getHeaders() {
    const token = process.env.GITHUB_TOKEN;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getRepository(owner: string, repo: string) {
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers: this.getHeaders() })
      );
      return response.data;
    } catch (error: any) {
      console.error('Erro getRepository:', error.response?.data || error.message);
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
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: this.getHeaders(),
          params: { since, until },
        })
      );
      return response.data;
    } catch (error: any) {
      console.error('Erro getCommits:', error.response?.data || error.message);
      throw new HttpException('Erro ao buscar commits.', HttpStatus.BAD_REQUEST);
    }
  }

  async getPullRequests(owner: string, repo: string, since?: string, until?: string, author?: string) {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=100`;
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers: this.getHeaders() })
      );
      let data = response.data;

      if (since) {
        const sinceDate = new Date(since);
        if (!isNaN(sinceDate.getTime())) {
          data = data.filter((item: any) => new Date(item.created_at) >= sinceDate);
        }
      }

      if (until) {
        const rawUntil = until.includes('T') ? until : `${until}T23:59:59Z`;
        const untilDate = new Date(rawUntil);
        if (!isNaN(untilDate.getTime())) {
          data = data.filter((item: any) => new Date(item.created_at) <= untilDate);
        }
      }

      if (author) {
        data = data.filter((item: any) => item.user?.login.toLowerCase() === author.toLowerCase());
      }

      return data;
    } catch (error: any) {
      console.error('Erro getPullRequests:', error.response?.data || error.message);
      throw new HttpException('Erro ao buscar Pull Requests.', HttpStatus.BAD_REQUEST);
    }
  }

  async getIssues(owner: string, repo: string, since?: string, until?: string, author?: string) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100`;
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers: this.getHeaders() })
      );
      let data = response.data;

      if (since) {
        const sinceDate = new Date(since);
        if (!isNaN(sinceDate.getTime())) {
          data = data.filter((item: any) => new Date(item.created_at) >= sinceDate);
        }
      }

      if (until) {
        const rawUntil = until.includes('T') ? until : `${until}T23:59:59Z`;
        const untilDate = new Date(rawUntil);
        if (!isNaN(untilDate.getTime())) {
          data = data.filter((item: any) => new Date(item.created_at) <= untilDate);
        }
      }

      if (author) {
        data = data.filter((item: any) => item.user?.login.toLowerCase() === author.toLowerCase());
      }

      return data;
    } catch (error: any) {
      console.error('Erro getIssues:', error.response?.data || error.message);
      throw new HttpException('Erro ao buscar Issues.', HttpStatus.BAD_REQUEST);
    }
  }
}