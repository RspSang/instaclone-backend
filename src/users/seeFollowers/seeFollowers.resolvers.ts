import { User } from "@prisma/client";
import { ERROR } from "../../shared/error";

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
          error: ERROR.noUser,
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
