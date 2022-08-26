import { protectedResolver } from "../../users/users.utils";

interface SeeFeedArgs {
  offset: number;
}

export default {
  Query: {
    seeFeed: protectedResolver(
      (_, { offset }: SeeFeedArgs, { client, loggedInUser }) =>
        client.photo.findMany({
          where: {
            OR: [
              { user: { followers: { some: { id: loggedInUser.id } } } },
              { user: { id: loggedInUser.id } },
            ],
          },
          take: 2,
          skip: offset,
          orderBy: { createdAt: "desc" },
        })
    ),
  },
};
