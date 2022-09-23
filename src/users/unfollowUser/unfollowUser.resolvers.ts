import { User } from "@prisma/client";
import { ERROR } from "../../shared/error";
import { protectedResolver } from "../users.utils";

interface UnfollowUserArgs {
  username: string;
}

export default {
  Mutation: {
    unfollowUser: protectedResolver(
      async (_, { username }: UnfollowUserArgs, { loggedInUser, client }) => {
        try {
          const user: User | null = await client.user.findUnique({
            where: { username },
          });
          if (!user) {
            return {
              ok: false,
              error: ERROR.noUser,
            };
          }
          await client.user.update({
            where: { id: loggedInUser.id },
            data: { following: { disconnect: { username } } },
          });
          return {
            ok: true,
            user,
          };
        } catch (error) {
          console.log(error);
        }
      }
    ),
  },
};
