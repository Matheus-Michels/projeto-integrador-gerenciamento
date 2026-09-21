import { NestFactory } from '@nestjs/core';
import { AppModule} from './app.module';
import supertokens from 'supertokens-node';
import { middleware } from 'supertokens-node/framework/express';
import { AuthFilter } from './auth/auth.filter';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  app.use(middleware());
  app.useGlobalFilters(new AuthFilter(), new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('API de Gerenciamento de Atividades')
    .setDescription('Documentação das rotas e serviços da aplicação')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
