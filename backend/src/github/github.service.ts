import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GithubService {
  constructor(private readonly httpService: HttpService) {}

  async getRepository(owner: string, repo: string) {
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      throw new HttpException('Erro ao buscar o repositório.', HttpStatus.BAD_REQUEST);
    }
  }

  async getCommits(owner: string, repo: string) {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits`;
    try {
      const response = await firstValueFrom(this.httpService.get(url));
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
}