import { User } from "@prisma/client";

interface SeeFollowingArgs {
  username: string;
  lastId: number;
}

export default {
  Query: {
    seeFollowing: async (
      _,
      { username, lastId }: SeeFollowingArgs,
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
          skip: lastId ? 1 : 0,
          ...(lastId && { lastId: { id: lastId } }),
        });
      return {
        ok: true,
        following,
      };
    },
  },
};
