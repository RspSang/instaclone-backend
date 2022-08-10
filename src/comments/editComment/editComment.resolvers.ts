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
          select: { userId: true },
        });
        if (!comment) {
          return {
            ok: false,
            error: "댓글을 찾을수없습니다",
          };
        } else if (comment.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: "인증되지 않은 유저입니다",
          };
        } else {
          await client.comment.update({ where: { id }, data: { payload } });
          return { ok: true };
        }
      }
    ),
  },
};
