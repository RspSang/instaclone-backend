import { protectedResolver } from "../../users/users.utils";

interface SeeFeedArgs {
  page: number;
}

export default {
  Query: {
    seeFeed: protectedResolver(
      (_, { page }: SeeFeedArgs, { client, loggedInUser }) =>
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
