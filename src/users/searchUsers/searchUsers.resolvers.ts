import { User } from "@prisma/client";

interface SearchUsersArgs {
  keyword: string;
  offset?: number;
}

export default {
  Query: {
    searchUsers: async (
      _,
      { keyword, offset }: SearchUsersArgs,
      { client }
    ) => {
      const users: User | null = await client.user.findMany({
        where: {
          username: {
            startsWith: keyword.toLowerCase(),
          },
        },
        take: 5,
        skip: offset,
      });
      return users;
    },
  },
};
