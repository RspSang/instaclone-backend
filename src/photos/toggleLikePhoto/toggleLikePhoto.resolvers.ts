import { protectedResolver } from "../../users/users.utils";

interface ToggleLikeArgs {
  id: number;
}

export default {
  Mutation: {
    toggleLike: protectedResolver(
      async (_, { id }: ToggleLikeArgs, { client, loggedInUser }) => {
        try {
          const photo = await client.photo.findUnique({ where: { id } });
          if (!photo) {
            return {
              ok: false,
              error: "사진을 찾을수 없습니다.",
            };
          }
          const likeWhere = {
            photoId_userId: {
              userId: loggedInUser.id,
              photoId: id,
            },
          };
          const like = await client.like.findUnique({
            where: likeWhere,
          });
          if (like) {
            await client.like.delete({
              where: likeWhere,
            });
          } else {
            await client.like.create({
              data: {
                user: {
                  connect: {
                    id: loggedInUser.id,
                  },
                },
                photo: {
                  connect: {
                    id: photo.id,
                  },
                },
              },
            });
            return {
              ok: true,
            };
          }
        } catch (error) {
          console.log(error);
        }
      }
    ),
  },
};
