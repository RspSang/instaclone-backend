import { Hashtag } from "@prisma/client";

interface SearchHashtagsProps {
  keyword: string;
  offset?: number;
}

export default {
  Query: {
    searchHashtags: async (
      _,
      { keyword, offset }: SearchHashtagsProps,
      { client }
    ) => {
      const hashtags: Hashtag | null = await client.Hashtag.findMany({
        where: {
          hashtag: {
            startsWith: keyword.toLowerCase(),
          },
        },
        take: 5,
        skip: offset,
      });
      return hashtags;
    },
  },
};
