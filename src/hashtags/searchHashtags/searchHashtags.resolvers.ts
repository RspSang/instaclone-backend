import { Hashtag } from "@prisma/client";

interface SearchHashtagsProps {
  keyword: string;
}

export default {
  Query: {
    searchHashtags: async (_, { keyword }: SearchHashtagsProps, { client }) => {
      const hashtags: Hashtag | null = await client.Hashtag.findMany({
        where: {
          hashtag: {
            startsWith: keyword.toLowerCase(),
          },
        },
      });
      return hashtags;
    },
  },
};
