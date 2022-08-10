export default {
  Query: {
    seePhotoLikes: async (_, { id }, { client }) => {
      const likes = await client.like.findMany({
        where: { photoId: id },
        select: { user: { select: { user: true } } },
      });
      return likes.map((like) => like.user);
    },
  },
};
