export default {
  Photo: {
    user: ({ userId }, _, { client }) =>
      client.user.findUnique({ where: { id: userId } }),
    likes: ({ id }, _, { client }) =>
      client.like.count({ where: { photoId: id } }),
    commentNumber: ({ id }, _, { client }) =>
      client.comment.count({ where: { photoId: id } }),
    comments: ({ id }, _, { client }) =>
      client.comment.findMany({
        where: { photoId: id },
        include: { user: true },
      }),
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
    isLiked: async ({ id }, _, { client, loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      const ok = await client.like.findUnique({
        where: {
          photoId_userId: {
            photoId: id,
            userId: loggedInUser.id,
          },
        },
        select: {
          id: true,
        },
      });
      if (ok) {
        return true;
      }
      return false;
    },
  },
};
