interface SearchPhotosArgs {
  keyword: string;
  offset: number;
}

export default {
  Query: {
    searchPhotos: (_, { keyword }: SearchPhotosArgs, { client }) =>
      client.photo.findMany({
        where: {
          caption: {
            startsWith: keyword,
          },
        },
      }),
  },
};
