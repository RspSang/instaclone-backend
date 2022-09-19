import { Photo } from ".prisma/client";

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
          error: "オススメ写真呼び出しに失敗しました。",
        };
      }
    },
  },
};

export default resolvers;
