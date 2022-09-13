import { User } from "@prisma/client";

interface SeeFollowingArgs {
  username: string;
  page: number;
}

export default {
  Query: {
    seeFollowing: async (
      _,
      { username, page }: SeeFollowingArgs,
      { client }
    ) => {
      const ok: User | null = await client.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (!ok) {
        return {
          ok: false,
          error: "유저를 찾지 못했습니다.",
        };
      }
      const following: User | null = await client.user
        .findUnique({ where: { username } })
        .following({
          take: 5,
          skip: (page - 1) * 5,
        });
      return {
        ok: true,
        following,
      };
    },
  },
};
