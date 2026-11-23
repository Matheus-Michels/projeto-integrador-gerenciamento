import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { SearchHistory } from '../entities/search-history.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class GithubService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(SearchHistory)
    private searchHistoryRepo: Repository<SearchHistory>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  private getHeaders() {
    const token = this.configService.get<string>('GITHUB_TOKEN');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async fetchAllPages(
    url: string,
    params: Record<string, any> = {},
  ): Promise<any[]> {
    const perPage = 100;
    const maxPages = 10;
    const all: any[] = [];

    for (let page = 1; page <= maxPages; page++) {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: this.getHeaders(),
          params: { ...params, per_page: perPage, page },
        }),
      );
      const items = response.data;
      all.push(...items);

      if (items.length < perPage) break;
    }

    return all;
  }

  private handleGithubError(error: any, defaultMessage: string): never {
    const status = error?.response?.status || HttpStatus.BAD_REQUEST;
    if (status === 403 || status === 429) {
      throw new HttpException(
        'O limite de requisições da API do GitHub foi excedido. Tente novamente mais tarde.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    if (status === 404) {
      throw new HttpException(
        'Repositório não encontrado no GitHub.',
        HttpStatus.NOT_FOUND,
      );
    }
    throw new HttpException(defaultMessage, status);
  }

  async getRepository(owner: string, repo: string) {
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers: this.getHeaders() }),
      );
      return response.data;
    } catch (error) {
      this.handleGithubError(error, 'Erro ao buscar o repositório.');
    }
  }

  async getCommits(owner: string, repo: string, since?: string, until?: string) {
    try {
      let user = await this.userRepo.createQueryBuilder().getOne();
      if (!user) {
        user = this.userRepo.create({
          name: 'Usuário Teste',
          email: 'teste@teste.com',
        });
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
        }),
      );
      return response.data;
    } catch (error) {
      this.handleGithubError(error, 'Erro ao buscar commits.');
    }
  }

  async getPullRequests(
    owner: string,
    repo: string,
    since?: string,
    until?: string,
    author?: string,
  ) {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls`;
    try {
      let data = await this.fetchAllPages(url, { state: 'all'});

      if (since) {
        const sinceDate = new Date(since);
        if (!isNaN(sinceDate.getTime())) {
          data = data.filter((item: any) => new Date(item.created_at) >= sinceDate);
        }
      }
      if (until) {
        const untilStr = until.includes('T') ? until.split('T')[0] : until;
        const untilDate = new Date(`${untilStr}T23:59:59.999Z`);
        if (!isNaN(untilDate.getTime())) {
          data = data.filter((item: any) => new Date(item.created_at) <= untilDate);
        }
      }
      if (author) {
        data = data.filter(
          (item: any) => item.user?.login?.toLowerCase() === author.toLowerCase(),
        );
      }

      return data;
    } catch (error) {
      this.handleGithubError(error, 'Erro ao buscar Pull Requests.');
    }
  }

  async getIssues(
    owner: string,
    repo: string,
    since?: string,
    until?: string,
    author?: string,
  ) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues`;
    try {
      let data = await this.fetchAllPages(url, { state: 'all' });

      if (since) {
        const sinceDate = new Date(since);
        if (!isNaN(sinceDate.getTime())) {
          data = data.filter((item: any) => new Date(item.created_at) >= sinceDate);
        }
      }
      if (until) {
        const untilStr = until.includes('T') ? until.split('T')[0] : until;
        const untilDate = new Date(`${untilStr}T23:59:59.999Z`);
        if (!isNaN(untilDate.getTime())) {
          data = data.filter((item: any) => new Date(item.created_at) <= untilDate);
        }
      }
      if (author) {
        data = data.filter(
          (item: any) => item.user?.login?.toLowerCase() === author.toLowerCase(),
        );
      }

      return data;
    } catch (error) {
      this.handleGithubError(error, 'Erro ao buscar Issues.');
    }
  }
}