import { User } from "@prisma/client";

interface SearchUsersArgs {
  keyword: string;
  lastId?: number;
}

export default {
  Query: {
    searchUsers: async (
      _,
      { keyword, lastId }: SearchUsersArgs,
      { client }
    ) => {
      const users: User | null = await client.user.findMany({
        where: {
          username: {
            startsWith: keyword.toLowerCase(),
          },
        },
        skip: lastId ? 1 : 0,
        ...(lastId && { lastId: { id: lastId } }),
      });
      return users;
    },
  },
};
