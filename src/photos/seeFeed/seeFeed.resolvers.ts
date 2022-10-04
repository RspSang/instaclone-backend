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
            user: { followers: { some: { id: loggedInUser.id } } },
          },
          take: 3,
          skip: offset,
          orderBy: { createdAt: "desc" },
        })
    ),
  },
};
