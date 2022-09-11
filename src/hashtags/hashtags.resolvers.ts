import { Hashtag, Photo } from ".prisma/client";
import { Context, Resolvers } from "../types";

interface HashtagsPhotosArgs {
  offset?: number;
}

const resolvers: Resolvers = {
  Hashtag: {
    photos: async (
      { id }: Hashtag,
      { offset }: HashtagsPhotosArgs,
      { client }: Context
    ): Promise<Photo[] | null> => {
      try {
        const foundPhotos: Photo[] = await client.photo.findMany({
          where: { hashtags: { some: { id } } },
          skip: offset,
          take: 12,
        });
        return foundPhotos;
      } catch (error) {
        console.log("photos error");
        return null;
      }
    },
    totalPhotos: async (
      { hashtag }: Hashtag,
      __,
      { client }: Context
    ): Promise<number> => {
      try {
        const countedPhotos: number = await client.photo.count({
          where: { hashtags: { some: { hashtag } } },
        });
        return countedPhotos;
      } catch (error) {
        console.log("totalPhotos error");
        return 0;
      }
    },
  },
};

export default resolvers;
