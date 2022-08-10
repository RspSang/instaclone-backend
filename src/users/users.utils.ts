import { User } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import client from "../client";
import { Resolver } from "../types";

declare module "jsonwebtoken" {
  export interface UserIDJwithPayload extends jwt.JwtPayload {
    id: number;
  }
}

export const getUser = async (
  token: string | string[] | undefined
): Promise<User | null> => {
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
  } catch {
    return null;
  }
};

export const protectedResolver =
  (ourResolver: Resolver) => (root, args, context, info) => {
    if (!context.loggedInUser) {
      const query = info.operation.operation === "query";
      if (query) {
        return null;
      }
      return {
        ok: false,
        error: "로그인이 필요한 서비스입니다.",
      };
    }
    return ourResolver(root, args, context, info);
  };
