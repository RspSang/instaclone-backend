import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from ".prisma/client";
import client from "../client";

interface CreateAccountArgs {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

interface LoginArgs {
  username: string;
  password: string;
}

export default {
  Mutation: {
    createAccount: async (
      _: any,
      { firstName, lastName, username, email, password }: CreateAccountArgs
    ): Promise<User | unknown> => {
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
        return error;
      }
    },
    login: async (_: any, { username, password }: LoginArgs) => {
      // find user with args.username
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return {
          ok: false,
          error: "존재하지않는 유저입니다",
        };
      }

      // check password with args.password
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return {
          ok: false,
          error: "잘못된 패스워드 입니다",
        };
      }
      // issue a token and send it to the user
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY!);
      return {
        ok: true,
        token,
      };
    },
  },
};
