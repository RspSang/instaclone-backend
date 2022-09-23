import * as bcrypt from "bcrypt";
import { User } from ".prisma/client";
import client from "../../client";
import { ERROR } from "../../shared/error";

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
          return {
            ok: false,
            error: ERROR.existUser,
          };
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
        console.log(error);
        return { ok: false, error: ERROR.createAccountError };
      }
    },
  },
};
