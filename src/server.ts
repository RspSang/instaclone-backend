import "dotenv/config";
import * as express from "express";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { createServer, Server } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { getUser } from "./users/users.utils";
import client from "./client";
import schema from "./schema";

const PORT = process.env.PORT;
const startServer = async (): Promise<void> => {
  const app = express();
  app.use(graphqlUploadExpress());
  app.use("/static", express.static("uploads"));
  const httpServer: Server = createServer(app);
  const subscriptionServer: SubscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: "/graphql" }
  );
  const apolloServer: ApolloServer<ExpressContext> = new ApolloServer({
    schema,
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.token),
        client,
      };
    },
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  httpServer.listen(PORT, () =>
    console.log(
      `🚀 Server: http://localhost:${PORT}${apolloServer.graphqlPath}`
    )
  );
};

startServer();
