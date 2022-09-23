import { ERROR } from "../../shared/error";
import { deleteFromS3 } from "../../shared/shared.utils";
import { protectedResolver } from "../../users/users.utils";

interface DeletePhotoArgs {
  id: number;
}

export default {
  Mutation: {
    deletePhoto: protectedResolver(
      async (_, { id }: DeletePhotoArgs, { client, loggedInUser }) => {
        const photo = await client.photo.findUnique({
          where: { id },
          select: { id: true, userId: true, file: true },
        });
        if (!photo) {
          return {
            ok: false,
            error: ERROR.noPhoto
          };
        } else if (photo.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: ERROR.invaildUser
          };
        } else {
          deleteFromS3(photo.file);
          await client.photo.delete({ where: { id } });
          return {
            ok: true,
            id: photo.id,
          };
        }
      }
    ),
  },
};
