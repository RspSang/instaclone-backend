import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    seeRoom: protectedResolver((_, { id }, { client, loggedInUser }) =>
      client.room.findFirst({
        where: { id, users: { some: { id: loggedInUser.id } } },
      })
    ),
  },
};
