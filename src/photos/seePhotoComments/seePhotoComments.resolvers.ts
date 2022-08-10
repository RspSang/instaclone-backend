interface SeePhotoCommentsArgs {
  id: number;
  page: number;
}

export default {
  Query: {
    seePhotoComments: (_, { id, page }: SeePhotoCommentsArgs, { client }) =>
      client.comment.findMany({
        where: { photoId: id },
        orderBy: { createdAt: "asc" },
        take: 5,
        skip: (page - 1) * 5,
      }),
  },
};
