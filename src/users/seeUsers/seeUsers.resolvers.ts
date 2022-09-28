import { User } from ".prisma/client";
import { ERROR } from "../../shared/error";
import { Context, Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeUsers: async (_, __, { client }: Context) => {
      try {
        const foundUsers: User[] = await client.user.findMany({
          include: { following: true, followers: true },
        });
        return {
          ok: true,
          users: foundUsers,
        };
      } catch (error) {
        console.log("seeUsers error");
        return {
          ok: false,
          error: ERROR.seeUsersError,
          users: [],
        };
      }
    },
  },
};

export default resolvers;
