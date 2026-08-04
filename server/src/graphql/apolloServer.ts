import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";

const server = new ApolloServer({
  typeDefs,
  resolvers
})
await server.start();
export default server;