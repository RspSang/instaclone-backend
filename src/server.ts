import "dotenv/config";
import { ApolloServer } from "apollo-server";
import schema from "./schema";
import { getUser } from "./users/users.utils";
import client from "./client";

const server: ApolloServer = new ApolloServer({
  schema,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
      client,
    };
  },
});

server.listen(process.env.PORT, (): void => {
  console.log(`🚀 Apollo Server: http://localhost:${process.env.PORT}`);
});
