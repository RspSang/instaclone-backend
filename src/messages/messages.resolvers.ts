export default {
  Room: {
    users: ({ id }, _, { client }) =>
      client.room.findUnique({ where: { id } }).users(),
    messages: ({ id }, _, { client }) =>
      client.message.findMany({ where: { roomId: id } }),
    unreadTotal: ({ id }, __, { client, loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      }
      return client.message.count({
        where: {
          read: false,
          roomId: id,
          user: { id: { not: loggedInUser.id } },
        },
      });
    },
  },
  Message: {
    user: ({ id }, _, { client }) =>
      client.message.findUnique({ where: { id } }).user(),
  },
};
