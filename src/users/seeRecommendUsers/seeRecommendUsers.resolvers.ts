import { User } from ".prisma/client";
import { ERROR } from "../../shared/error";

const resolvers = {
  Query: {
    seeRecommendUsers: async (_, __, { client, loggedInUser }) => {
      try {
        const foundUsers: User[] = await client.user.findMany({
          where: { NOT: { id: loggedInUser?.id } },
          take: 5,
        });
        return {
          ok: true,
          users: foundUsers,
        };
      } catch (error) {
        console.log("seeRecommendUsers error");
        return {
          ok: false,
          message: ERROR.recommendUserError,
        };
      }
    },
  },
};

export default resolvers;
