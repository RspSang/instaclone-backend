import { User } from ".prisma/client";

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
          message: "オススメユーザ呼び出しに失敗しました。",
        };
      }
    },
  },
};

export default resolvers;
