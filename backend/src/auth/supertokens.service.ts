import { Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import ThirdParty from 'supertokens-node/recipe/thirdparty';
import EmailPassword from 'supertokens-node/recipe/emailpassword';

@Injectable()
export class SupertokensService {
  constructor() {
    supertokens.init({
      framework: 'express',
      supertokens: {
        connectionURI: process.env.SUPERTOKENS_URI || 'https://localhost:3567',
      },
      appInfo: {
        appName: 'Gerenciamento de Atividades',
        apiDomain: process.env.API_DOMAIN || 'http://localhost:3000',
        websiteDomain: process.env.WEBSITE_DOMAIN || 'http://localhost:3001',
        apiBasePath: '/auth',
        websiteBasePath: '/auth',
      },
        recipeList: [
            EmailPassword.init(),
        ThirdParty.init({
          signInAndUpFeature: {
            providers: [
              {
                config: {
                  thirdPartyId: 'github',
                  clients: [
                    {
                      clientId: process.env.GITHUB_CLIENT_ID || 'GITHUB_CLIENT_ID',
                      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'GITHUB_CLIENT_SECRET',
                    },
                  ],
                },
              },
            ],
          },
        }),
        Session.init(),
      ],
    });
  }
}