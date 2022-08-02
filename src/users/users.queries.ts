import { User } from ".prisma/client";
import client from "../client";

interface SeeProfileArgs {
  username: string;
}

export default {
  Query: {
    seeProfile: async (
      _: any,
      { username }: SeeProfileArgs
    ): Promise<User | null> => {
      try {
        const foundUser: User | null = await client.user.findUnique({
          where: { username },
        });

        if (foundUser === null) {
          throw new Error("존재하지 않는 유저입니다.");
        }

        return foundUser;
      } catch (error) {
        console.log("seeProfile error");
        return null;
      }
    },
  },
};
