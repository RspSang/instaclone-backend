import { ReadStream, WriteStream, createWriteStream } from "fs";
import * as bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";

interface EditProfileResultArgs {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  bio?: string;
  avatar?: any;
}

interface AvatarFile {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => ReadStream;
}

export default {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        {
          firstName,
          lastName,
          username,
          email,
          password: newPassword,
          bio,
          avatar,
        }: EditProfileResultArgs,
        { loggedInUser, client }
      ) => {
        let avatarUrl: string | undefined = undefined;
        if (avatar) {
          const { filename, createReadStream }: AvatarFile = await avatar.file;
          const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
          const readStream: ReadStream = createReadStream();
          const writeStream: WriteStream = createWriteStream(
            process.cwd() + "/uploads/" + newFilename
          );
          readStream.pipe(writeStream);
          avatarUrl = `http://localhost:4000/static/${newFilename}`;
        }

        let hashedPassword: string | undefined = undefined;
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
            bio,
            ...(hashedPassword && { password: hashedPassword }),
            ...(avatarUrl && { avatar: avatarUrl }),
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
      }
    ),
  },
};
