import { protectedResolver } from "../../users/users.utils";

interface SendMessageArgs {
  payload: string;
  roomId?: number;
  userId?: number;
}

export default {
  Mutation: {
    sendMessage: protectedResolver(
      async (
        _,
        { payload, roomId, userId }: SendMessageArgs,
        { client, loggedInUser }
      ) => {
        let room = null;
        if (userId) {
          const user = await client.user.findUnique({
            where: { id: userId },
            select: { id: true },
          });
          if (!user) {
            return {
              ok: false,
              error: "유저가 존재하지 않습니다",
            };
          }
          room = await client.room.create({
            data: {
              users: { connect: [{ id: userId }, { id: loggedInUser.id }] },
            },
          });
        } else if (roomId) {
          room = await client.room.findUnique({
            where: { id: roomId },
            select: { id: true },
          });
          if (!room) {
            return {
              ok: false,
              error: "채팅방을 찾지 못했습니다",
            };
          }
        }
        const newMessage = await client.message.create({
          data: {
            payload,
            room: { connect: { id: room.id } },
            user: { connect: { id: loggedInUser.id } },
          },
        });
        return {
          ok: true,
        };
      }
    ),
  },
};
