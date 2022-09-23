import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { ERROR } from "../../shared/error";
import { Resolvers } from "../../types";

interface LoginArgs {
  username: string;
  password: string;
}

const resolvers: Resolvers = {
  Mutation: {
    login: async (_, { username, password }: LoginArgs, { client }) => {
      // find user with args.username
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return {
          ok: false,
          error: ERROR.noUser
        };
      }

      // check password with args.password
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return {
          ok: false,
          error: ERROR.invaildPassword
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

export default resolvers;
