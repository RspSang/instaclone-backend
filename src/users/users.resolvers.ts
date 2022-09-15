export default {
  User: {
    totalFollowing: ({ id }, _, { client }) =>
      client.user.count({ where: { followers: { some: { id } } } }),
    totalFollowers: ({ id }, _, { client }) =>
      client.user.count({ where: { following: { some: { id } } } }),
    isMe: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
    },
    totalPhotos: async ({ id }, _, { client }) => {
      try {
        const countedPhotos: number = await client.photo.count({
          where: { userId: id },
        });
        return countedPhotos;
      } catch (error) {
        console.log("totalPhotos error");
        return 0;
      }
    },
    isFollowing: async ({ id }, _, { client, loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      const exists = await client.user.count({
        where: {
          username: loggedInUser.username,
          following: {
            some: {
              id,
            },
          },
        },
      });
      return Boolean(exists);
    },
    photos: ({ id }, { page }, { client }) =>
      client.user
        .findUnique({ where: { id } })
        .photos({ take: 5, skip: (page - 1) * 5 }),
  },
};
