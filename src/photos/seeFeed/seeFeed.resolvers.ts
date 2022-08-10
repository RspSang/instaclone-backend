import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    seeFeed: protectedResolver((_, { page }, { client, loggedInUser }) =>
      client.photo.findMany({
        where: {
          OR: [
            { user: { followers: { some: { id: loggedInUser.id } } } },
            { user: { id: loggedInUser.id } },
          ],
        },
        take: 5,
        skip: (page - 1) * 5,
        orderBy: { createdAt: "desc" },
      })
    ),
  },
};
