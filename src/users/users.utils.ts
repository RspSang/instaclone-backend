import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import client from "../client";

declare module "jsonwebtoken" {
  export interface UserIDJwithPayload extends jwt.JwtPayload {
    id: number;
  }
}

export const getUser = async (
  token: string | string[] | undefined
): Promise<User | unknown> => {
  try {
    if (!token) {
      return null;
    }
    const { id } = <jwt.UserIDJwithPayload>(
      jwt.verify(token as string, process.env.SECRET_KEY as string)
    );
    const user = await client.user.findUnique({ where: { id } });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    return error;
  }
};
