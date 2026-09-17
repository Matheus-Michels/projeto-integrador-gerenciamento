import { Module } from '@nestjs/common';
import { SupertokensService } from './supertokens.service';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [SupertokensService, AuthGuard],
  exports: [SupertokensService, AuthGuard],
})
export class AuthModule {}