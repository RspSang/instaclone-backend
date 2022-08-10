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
            error: "댓글을 찾지 못하였습니다",
          };
        } else if (comment.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: "인증되지 않은 유저입니다",
          };
        } else {
          await client.comment.delete({ where: { id } });
          return {
            ok: true,
          };
        }
      }
    ),
  },
};
