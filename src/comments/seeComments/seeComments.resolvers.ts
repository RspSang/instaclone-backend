import { Comment } from ".prisma/client";
import { ERROR } from "../../shared/error";
import { Context, Resolvers } from "../../types";

interface SeeCommentsArgs {
  photoId: number;
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
      { photoId }: SeeCommentsArgs,
      { client }: Context
    ): Promise<SeeCommentsResult> => {
      try {
        const countedPhoto: number = await client.photo.count({
          where: { id: photoId },
        });

        if (countedPhoto === 0) {
          return { ok: false, error: ERROR.noPhoto};
        }

        const foundComments: Comment[] = await client.comment.findMany({
          where: { photoId },
          include: { user: true },
          orderBy: { createdAt: "desc" },
        });

        return {
          ok: true,
          comments: foundComments,
        };
      } catch (error) {
        console.log("seeComments error");
        return { ok: false, error: ERROR.commentError };
      }
    },
  },
};

export default resolvers;
