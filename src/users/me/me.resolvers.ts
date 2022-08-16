import { protectedResolver } from "../users.utils";

export default {
  Query: {
    me: protectedResolver((_, __, { client, loggedInUser }) =>
      client.user.findUnique({ where: { id: loggedInUser.id } })
    ),
  },
};
