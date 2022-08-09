import { protectedResolver } from "../../users/users.utils";

interface UploadPhotoArgs {
  file: string;
  caption?: string;
}

export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (
        _,
        { file, caption }: UploadPhotoArgs,
        { loggedInUser, client }
      ) => {
        // parse caption
        let hashtagObj = null;
        if (caption) {
          const hashtags = caption.match(
            /#[a-zA-Z0-9가-힇ㄱ-ㅎㅏ-ㅣぁ-ゔァ-ヴー々〆〤一-龥\w]+/g
          );
          hashtagObj = hashtags.map((hashtag) => ({
            where: { hashtag },
            create: { hashtag },
          }));
        }
        // get or create Hashtags
        return client.photo.create({
          data: {
            file,
            caption,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(hashtagObj.length > 0 && {
              hashtags: {
                connectOrCreate: hashtagObj,
              },
            }),
          },
        });
      }
      // save the photo with the parsed hashtags
      // add the photo to the hashtags
    ),
  },
};
