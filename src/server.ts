import "dotenv/config";
import * as express from "express";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { getUser } from "./users/users.utils";
import client from "./client";
import { resolvers, typeDefs } from "./schema";

const PORT = process.env.PORT;
const startServer = async (): Promise<void> => {
  const apolloServer: ApolloServer<ExpressContext> = new ApolloServer({
    resolvers,
    typeDefs,
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.token),
        client,
      };
    },
  });
  await apolloServer.start();

  const app = express();
  app.use(graphqlUploadExpress());
  app.use("/static", express.static("uploads"));
  apolloServer.applyMiddleware({ app });
  await new Promise<void>((resolve) => app.listen({ port: PORT }, resolve));
  console.log(`🚀 Server: http://localhost:${PORT}${apolloServer.graphqlPath}`);
};

startServer();
