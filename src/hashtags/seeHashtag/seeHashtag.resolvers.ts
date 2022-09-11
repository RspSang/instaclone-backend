interface SeeHashtagArgs {
  hashtag: string;
  offset: number;
}

export default {
  Query: {
    seeHashtag: (_, { hashtag }: SeeHashtagArgs, { client }) =>
      client.hashtag.findUnique({ where: { hashtag } }),
  },
};
