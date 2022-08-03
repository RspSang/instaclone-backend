import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import client from "../../client";

interface EditProfileResultArgs {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
}

export default {
  Mutation: {
    editProfile: async (
      _: any,
      {
        firstName,
        lastName,
        username,
        email,
        password: newPassword,
      }: EditProfileResultArgs,
      { loggedInUser }
    ): Promise<User | unknown> => {
      let hashedPassword: string | null = null;
      if (newPassword) {
        hashedPassword = await bcrypt.hash(newPassword, 10);
      }
      const updateUser = await client.user.update({
        where: { id: loggedInUser.id },
        data: {
          firstName,
          lastName,
          username,
          email,
          ...(hashedPassword && { password: hashedPassword }),
        },
      });
      if (updateUser.id) {
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
          error: "프로필을 업데이트할 수 없습니다",
        };
      }
    },
  },
};
