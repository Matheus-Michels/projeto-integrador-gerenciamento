import { Controller, Get, Param } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get(':owner/:repo')
  async getRepository(@Param('owner') owner: string, @Param('repo') repo: string) {
    return this.githubService.getRepository(owner, repo);
  }

  @Get(':owner/:repo/commits')
  async getCommits(@Param('owner') owner: string, @Param('repo') repo: string) {
    return this.githubService.getCommits(owner, repo);
  }

  @Get(':owner/:repo/pulls')
  async getPullRequests(@Param('owner') owner: string, @Param('repo') repo: string) {
    return this.githubService.getPullRequests(owner, repo);
  }
}