import { ERROR } from "../../shared/error";
import { protectedResolver } from "../../users/users.utils";

interface DeleteCommentArgs {
  id: number;
}

export default {
  Mutation: {
    deleteComment: protectedResolver(
      async (_, { id }: DeleteCommentArgs, { client, loggedInUser }) => {
        const comment = await client.comment.findUnique({ where: { id } });
        if (!comment) {
          return {
            ok: false,
            error: ERROR.noComment,
          };
        } else if (comment.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: ERROR.invaildUser,
          };
        } else {
          await client.comment.delete({ where: { id } });
          return {
            ok: true,
            id: comment.id,
          };
        }
      }
    ),
  },
};
