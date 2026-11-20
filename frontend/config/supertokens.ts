import SuperTokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import EmailPassword from 'supertokens-web-js/recipe/emailpassword';
import ThirdParty from 'supertokens-web-js/recipe/thirdparty';

let isInitialized = false;

export const initSuperTokens = () => {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  SuperTokens.init({
    appInfo: {
      appName: 'Gerenciamento de Atividades',
      apiDomain: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      apiBasePath: '/auth',
    },
    recipeList: [
      EmailPassword.init(),
      ThirdParty.init(),
      Session.init({
        tokenTransferMethod: 'header',
      }),
    ],
  });
};