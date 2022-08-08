import { User } from "@prisma/client";
import { protectedResolver } from "../users.utils";

interface FollowUserArgs {
  username: string;
}

export default {
  Mutation: {
    followUser: protectedResolver(
      async (_, { username }: FollowUserArgs, { loggedInUser, client }) => {
        const ok: User = await client.user.findUnique({ where: { username } });
        if (!ok)
          return {
            ok: false,
            error: "팔로우할 유저가 존재하지 않습니다.",
          };
        await client.user.update({
          where: { id: loggedInUser.id },
          data: { following: { connect: { username } } },
        });
        return {
          ok: true,
        };
      }
    ),
  },
};
