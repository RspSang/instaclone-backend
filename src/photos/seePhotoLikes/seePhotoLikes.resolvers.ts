import { User } from "@prisma/client";

interface SeePhotoLikesArgs {
  photoId: number;
}

export default {
  Query: {
    seePhotoLikes: async (_, { photoId }: SeePhotoLikesArgs, { client }) => {
      try {
        const foundPhoto: number = await client.photo.count({
          where: { id: photoId },
        });
        if (foundPhoto === 0) {
          return { ok: false, error: "存在しない写真です。" };
        }

        const foundLikeUsers: User[] = await client.user.findMany({
          where: { likes: { some: { photoId } } },
        });

        return {
          ok: true,
          users: foundLikeUsers,
        };
      } catch (error) {
        console.log("seePhotoLikes error");
        return {
          ok: false,
          error: "「いいね」リスト呼び出しに失敗しました。",
        };
      }
    },
  },
};
