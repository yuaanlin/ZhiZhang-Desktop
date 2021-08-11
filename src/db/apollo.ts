import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client';
import {MONGODB_REALMS_GRAPHQL_URI} from '../config';

async function getValidAccessToken(app: Realm.App) {
    console.log('a');
  if (!app.currentUser) {
    console.log('b');
    await app.logIn(Realm.Credentials.anonymous());
  } else {
    await app.currentUser.refreshCustomData();
  }

  if(!app.currentUser) throw new Error("AUTH_FAILED")

  return app.currentUser.accessToken
}

export const client =(app: Realm.App) => new ApolloClient({
  link: new HttpLink({
    uri: MONGODB_REALMS_GRAPHQL_URI,
    fetch: async (uri, options) => {
      const accessToken = await getValidAccessToken(app);
      if(options?.headers) {
        // @ts-ignore
        options.headers.Authorization = `Bearer ${accessToken}`;
      }
      return fetch(uri, options);
    },
  }),
  cache: new InMemoryCache()
});
