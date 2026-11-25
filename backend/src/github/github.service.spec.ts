import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { GithubService } from './github.service';
import { SearchHistory } from '../entities/search-history.entity';
import { User } from '../entities/user.entity';

describe('GithubService', () => {
  let service: GithubService;
  let httpService: { get: jest.Mock };
  let searchHistoryRepo: { create: jest.Mock; save: jest.Mock };
  let userRepo: {
    createQueryBuilder: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(async () => {
    httpService = { get: jest.fn() };
    searchHistoryRepo = {
      create: jest.fn((dto) => dto),
      save: jest.fn().mockResolvedValue({}),
    };
    userRepo = {
      createQueryBuilder: jest.fn().mockReturnValue({
        getOne: jest.fn().mockResolvedValue({ id: 1, name: 'Usuário Teste' }),
      }),
      create: jest.fn((dto) => dto),
      save: jest.fn().mockResolvedValue({ id: 1, name: 'Usuário Teste' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GithubService,
        { provide: HttpService, useValue: httpService },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('fake-token') },
        },
        {
          provide: getRepositoryToken(SearchHistory),
          useValue: searchHistoryRepo,
        },
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get<GithubService>(GithubService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRepository', () => {
    it('deve retornar os dados do repositório com sucesso', async () => {
      const mockRepo = { id: 1, name: 'react', full_name: 'facebook/react' };
      httpService.get.mockReturnValue(of({ data: mockRepo }));

      const result = await service.getRepository('facebook', 'react');

      expect(result).toEqual(mockRepo);
      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.github.com/repos/facebook/react',
        { headers: { Authorization: 'Bearer fake-token' } },
      );
    });

    it('deve lançar 404 quando o repositório não existir', async () => {
      httpService.get.mockReturnValue(
        throwError(() => ({ response: { status: 404 } })),
      );

      await expect(
        service.getRepository('inexistente', 'repo'),
      ).rejects.toThrow(
        new HttpException(
          'Repositório não encontrado no GitHub.',
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('deve lançar 429 quando o limite da API (rate limit) for excedido', async () => {
      httpService.get.mockReturnValue(
        throwError(() => ({ response: { status: 403 } })),
      );

      await expect(service.getRepository('facebook', 'react')).rejects.toThrow(
        new HttpException(
          'O limite de requisições da API do GitHub foi excedido. Tente novamente mais tarde.',
          HttpStatus.TOO_MANY_REQUESTS,
        ),
      );
    });
  });

  describe('getPullRequests', () => {
    const mockPRs = [
      {
        id: 1,
        title: 'PR antigo',
        created_at: '2025-01-10T10:00:00Z',
        user: { login: 'Matheus' },
      },
      {
        id: 2,
        title: 'PR no período',
        created_at: '2026-05-15T12:00:00Z',
        user: { login: 'Thales' },
      },
      {
        id: 3,
        title: 'PR outro autor',
        created_at: '2026-05-20T18:00:00Z',
        user: { login: 'Matheus' },
      },
    ];

    it('deve filtrar Pull Requests por since, until (ISO) e author (case-insensitive)', async () => {
      httpService.get.mockReturnValue(of({ data: mockPRs }));

      const result = await service.getPullRequests(
        'owner',
        'repo',
        '2026-01-01',
        '2026-05-31T00:00:00.000Z',
        'thales',
      );

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });
  });

  describe('getIssues', () => {
    const mockIssues = [
      {
        id: 10,
        title: 'Issue 1',
        created_at: '2026-03-01T10:00:00Z',
        user: { login: 'Matheus' },
      },
      {
        id: 11,
        title: 'Issue 2',
        created_at: '2026-08-01T10:00:00Z',
        user: { login: 'Thales' },
      },
    ];

    it('deve filtrar Issues por período e autor', async () => {
      httpService.get.mockReturnValue(of({ data: mockIssues }));

      const result = await service.getIssues(
        'owner',
        'repo',
        '2026-01-01',
        '2026-06-01',
        'MATHEUS',
      );

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(10);
    });
  });

  describe('getCommits', () => {
    it('deve registrar histórico no banco e retornar os commits', async () => {
      const mockCommits = [{ sha: 'abc123', commit: { message: 'feat: init' } }];
      httpService.get.mockReturnValue(of({ data: mockCommits }));

      const result = await service.getCommits(
        'facebook',
        'react',
        '2026-01-01',
        '2026-12-31',
      );

      expect(searchHistoryRepo.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCommits);
    });
  });
});