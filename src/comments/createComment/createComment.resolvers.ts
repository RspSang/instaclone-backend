import { protectedResolver } from "../../users/users.utils";

interface CreateCommentArgs {
  photoId: number;
  payload: string;
}

export default {
  Mutation: {
    createComment: protectedResolver(
      async (
        _,
        { photoId, payload }: CreateCommentArgs,
        { client, loggedInUser }
      ) => {
        const ok = await client.photo.findUnique({
          where: { id: photoId },
          select: { id: true },
        });
        if (!ok) {
          return {
            ok: false,
            error: "사진을 찾을수 없습니다",
          };
        }
        await client.comment.create({
          data: {
            payload,
            photo: {
              connect: { id: photoId },
            },
            user: {
              connect: { id: loggedInUser.id },
            },
          },
        });
        return {
          ok: true,
        };
      }
    ),
  },
};
