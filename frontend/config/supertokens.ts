import SuperTokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import EmailPassword from 'supertokens-web-js/recipe/emailpassword';

export const initSuperTokens = () => {
  SuperTokens.init({
    appInfo: {
        appName: 'Gerenciamento de Atividades',
        apiDomain: 'http://localhost:3000',
        apiBasePath: '/auth',
    },
    recipeList: [
        EmailPassword.init(),
        Session.init(),
    ],
  });
};