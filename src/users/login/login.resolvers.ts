import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../../client";

interface LoginArgs {
  username: string;
  password: string;
}

export default {
  Mutation: {
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
