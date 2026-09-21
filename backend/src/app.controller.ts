import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Verifica o status da API' })
  @ApiResponse({ status: 200, description: 'Retorna mensagem de status da aplicação.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
