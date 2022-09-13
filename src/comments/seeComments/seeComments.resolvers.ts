import { Comment } from ".prisma/client";
import { Context, Resolvers } from "../../types";

interface SeeCommentsArgs {
  photoId: number;
  offset?: number;
}

interface SeeCommentsResult {
  ok: boolean;
  error?: string;
  comments?: Comment[];
}

const resolvers: Resolvers = {
  Query: {
    seeComments: async (
      _,
      { photoId, offset }: SeeCommentsArgs,
      { client }: Context
    ): Promise<SeeCommentsResult> => {
      try {
        const countedPhoto: number = await client.photo.count({
          where: { id: photoId },
        });

        if (countedPhoto === 0) {
          return { ok: false, error: "存在しない写真です。" };
        }

        const foundComments: Comment[] = await client.comment.findMany({
          where: { photoId },
          include: { user: true },
          orderBy: { createdAt: "desc" },
          skip: offset,
          take: 15,
        });

        return {
          ok: true,
          comments: foundComments,
        };
      } catch (error) {
        console.log("seeComments error");
        return { ok: false, error: "コメント呼び出しに失敗しました。" };
      }
    },
  },
};

export default resolvers;
