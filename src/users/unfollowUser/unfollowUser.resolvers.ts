import { User } from "@prisma/client";
import { protectedResolver } from "../users.utils";

interface UnfollowUserArgs {
  username: string;
}

export default {
  Mutation: {
    unfollowUser: protectedResolver(
      async (_, { username }: UnfollowUserArgs, { loggedInUser, client }) => {
        const user: User | null = await client.user.findUnique({
          where: { username },
        });
        if (!user) {
          return {
            ok: false,
            error: "유저 언팔로우에 실패하였습니다",
          };
        }
        await client.user.update({
          where: { id: loggedInUser.id },
          data: { followers: { disconnect: { username } } },
        });
        return {
          ok: true,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
          },
        };
      }
    ),
  },
};
