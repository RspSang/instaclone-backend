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
          select: { userId: true },
        });
        if (!photo) {
          return {
            ok: false,
            error: "사진을 찾지 못하였습니다",
          };
        } else if (photo.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: "인증되지 않은 유저입니다",
          };
        } else {
          await client.photo.delete({ where: { id } });
          return {
            ok: true,
          };
        }
      }
    ),
  },
};