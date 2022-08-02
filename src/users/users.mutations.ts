import * as bcrypt from "bcrypt";
import { User } from ".prisma/client";
import client from "../client";

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
      _: any,
      { firstName, lastName, username, email, password }: CreateAccountArgs
    ): Promise<User | null> => {
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
        const createdUser: User = await client.user.create({
          data: {
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
          },
        });
        return createdUser;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  },
};
