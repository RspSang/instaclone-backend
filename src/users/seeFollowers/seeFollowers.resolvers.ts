import { User } from "@prisma/client";

interface SeeFollowersArgs {
  username: string;
  page: number;
}

export default {
  Query: {
    seeFollowers: async (
      _,
      { username, page }: SeeFollowersArgs,
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
      const followers: User | null = await client.user
        .findUnique({ where: { username } })
        .followers({ take: 5, skip: (page - 1) * 5 });
      const totalFollowers = await client.user.count({
        where: { following: { some: { username } } },
      });
      return {
        ok: true,
        followers,
        total: Math.ceil(totalFollowers / 5),
      };
    },
  },
};
