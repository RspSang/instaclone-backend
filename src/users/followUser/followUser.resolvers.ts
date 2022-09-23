import { User } from "@prisma/client";
import { ERROR } from "../../shared/error";
import { protectedResolver } from "../users.utils";

interface FollowUserArgs {
  username: string;
}

export default {
  Mutation: {
    followUser: protectedResolver(
      async (_, { username }: FollowUserArgs, { loggedInUser, client }) => {
        const user: User | null = await client.user.findUnique({
          where: { username },
        });
        if (!user)
          return {
            ok: false,
            error: ERROR.noFollowUser,
          };
        await client.user.update({
          where: { id: loggedInUser.id },
          data: { following: { connect: { username } } },
        });
        return {
          ok: true,
          user,
        };
      }
    ),
  },
};
