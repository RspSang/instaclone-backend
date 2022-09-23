import { ERROR } from "../../shared/error";
import { protectedResolver } from "../../users/users.utils";

interface EditCommentArgs {
  id: number;
  payload: string;
}

export default {
  Mutation: {
    editComment: protectedResolver(
      async (_, { id, payload }: EditCommentArgs, { client, loggedInUser }) => {
        const comment = await client.comment.findUnique({
          where: { id },
          select: { id: true, userId: true },
        });
        if (!comment) {
          return {
            ok: false,
            error: ERROR.noComment
          };
        } else if (comment.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: ERROR.invaildUser
          };
        } else {
          await client.comment.update({ where: { id }, data: { payload } });
          return { ok: true, id: comment.id };
        }
      }
    ),
  },
};
