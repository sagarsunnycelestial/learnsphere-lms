import { ApolloServer } from '@apollo/server';
import { typeDefs } from './typeDefs.js';
import { resolvers } from './resolvers.js';
import { ApolloLogginPlugin } from '../config/apolloLoggingPlugin.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins:[ApolloLogginPlugin]
});
await server.start();
export default server;
