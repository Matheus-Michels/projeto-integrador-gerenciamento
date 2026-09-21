import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GithubService } from './github.service';

@ApiTags('github')
@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get(':owner/:repo')
  @ApiOperation({
    summary: 'Busca informações de um repositório no GitHub',
    description: 'Consulta os dados públicos de um repositório a partir do proprietário e do nome do repositório.',
  })
  @ApiParam({
    name: 'owner',
    description: 'Nome de usuário ou organização proprietária no GitHub',
    example: 'octocat',
  })
  @ApiParam({
    name: 'repo',
    description: 'Nome do repositório',
    example: 'Hello-World',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do repositório obtidos com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Repositório não encontrado no GitHub.',
  })
  @ApiResponse({
    status: 429,
    description: 'Limite de requisições excedido na API do GitHub.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao processar a requisição.',
  })
  async getRepository(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
  ) {
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