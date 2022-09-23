import { ERROR } from "../../shared/error";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

interface EditPhotoArgs {
  id: number;
  caption: string;
}

export default {
  Mutation: {
    editPhoto: protectedResolver(
      async (_, { id, caption }: EditPhotoArgs, { client, loggedInUser }) => {
        const oldPhoto = await client.photo.findFirst({
          where: { id, userId: loggedInUser.id },
          include: { hashtags: { select: { hashtag: true } } },
        });
        if (!oldPhoto) {
          return {
            ok: false,
            error: ERROR.noPhoto
          };
        }
        const photo = await client.photo.update({
          where: { id },
          data: {
            caption,
            hashtags: {
              disconnect: oldPhoto.hashtags,
              connectOrCreate: processHashtags(caption),
            },
          },
        });
        return { ok: true, id: oldPhoto.id };
      }
    ),
  },
};
