import { User } from ".prisma/client";
import { ERROR } from "../../shared/error";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeProfile: async (_, { username }, { client }) => {
      try {
        const foundUser: User | null = await client.user.findUnique({
          where: { username },
        });
        if (foundUser === null) {
          throw new Error(ERROR.noUser);
        }
        return foundUser;
      } catch (error) {
        return error;
      }
    },
  },
};

export default resolvers;
