interface SeePhotoArgs {
  id: number;
}

export default {
  Query: {
    seePhoto: (_, { id }: SeePhotoArgs, { client }) =>
      client.photo.findUnique({ where: { id } }),
  },
};
