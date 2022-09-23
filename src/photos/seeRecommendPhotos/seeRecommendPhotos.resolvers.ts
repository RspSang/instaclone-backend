import { Photo } from ".prisma/client";
import { ERROR } from "../../shared/error";

const resolvers = {
  Query: {
    seeRecommendPhotos: async (_, __, { client }) => {
      try {
        const foundPhotos: Photo[] = await client.photo.findMany({ take: 25 });
        return {
          ok: true,
          photos: foundPhotos,
        };
      } catch (error) {
        console.log("seeRecommendPhotos error");
        return {
          ok: false,
          error: ERROR.recommendPhotoError,
        };
      }
    },
  },
};

export default resolvers;
