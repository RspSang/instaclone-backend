import * as bcrypt from "bcrypt";
import { User } from ".prisma/client";
import client from "../../client";

interface CreateAccountArgs {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }: CreateAccountArgs
    ) => {
      try {
        // check if username or email are already on DB.
        const existingUser: User | null = await client.user.findFirst({
          where: { OR: [{ username }, { email }] },
        });
        if (existingUser) {
          throw new Error("이미 존재하는 이메일 또는 유저명입니다.");
        }

        // hash password
        const hashedPassword: string = await bcrypt.hash(password, 10);

        // save and return the user
        await client.user.create({
          data: {
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
          },
        });
        return { ok: true };
      } catch (error) {
        return { ok: false, error: "계정을 만들수 없습니다." };
      }
    },
  },
};
