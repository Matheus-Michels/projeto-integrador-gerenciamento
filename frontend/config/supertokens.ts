import SuperTokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import EmailPassword from 'supertokens-web-js/recipe/emailpassword';
import ThirdParty from 'supertokens-web-js/recipe/thirdparty';

export const initSuperTokens = () => {
  SuperTokens.init({
    appInfo: {
      appName: 'Gerenciamento de Atividades',
      apiDomain: 'http://localhost:3000',
      apiBasePath: '/auth',
    },
    recipeList: [
      EmailPassword.init(),
      ThirdParty.init(),
      Session.init(),
    ],
  });
};