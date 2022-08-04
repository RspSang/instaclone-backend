import { User } from ".prisma/client";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeProfile: async (_, { username }, { client }) => {
      try {
        const foundUser: User | null = await client.user.findUnique({
          where: { username },
        });
        if (foundUser === null) {
          throw new Error("존재하지 않는 유저입니다.");
        }
        return foundUser;
      } catch (error) {
        return error;
      }
    },
  },
};

export default resolvers;
