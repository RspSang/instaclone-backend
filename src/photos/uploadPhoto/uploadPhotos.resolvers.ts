import { uploadToS3 } from "../../shared/shared.utils";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

interface UploadPhotoArgs {
  file: any;
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
        let hashtagObj = [];
        if (caption) {
          hashtagObj = processHashtags(caption);
        }
        const fileUrl = await uploadToS3(file, loggedInUser.id, "uploads");
        return client.photo.create({
          data: {
            file: fileUrl,
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
    ),
  },
};
