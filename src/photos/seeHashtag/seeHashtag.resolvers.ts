interface SeeHashtagArgs {
  hashtag: string;
}

export default {
  Query: {
    seeHashtag: (_, { hashtag }: SeeHashtagArgs, { client }) =>
      client.hashtag.findUnique({ where: { hashtag } }),
  },
};
