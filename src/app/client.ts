/**
 * Created by Tobia on 12/04/17.
 */
import config from '../config';
import ApolloClient, {
  createNetworkInterface
} from 'apollo-client';

const networkInterface = createNetworkInterface({
  uri: config.url
});
networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};
      }
      if (localStorage.getItem('SCAPHOLD_AUTH_TOKEN')) {
        req.options.headers['Authorization'] = `Bearer ${localStorage.getItem('SCAPHOLD_AUTH_TOKEN')}`;
      }
      next();
    }
  }
]);

const apolloClient = new ApolloClient({
  networkInterface
});

// export default apolloClient;

export function provideClient(): ApolloClient {
  return apolloClient;
}
