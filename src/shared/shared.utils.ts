import * as AWS from "aws-sdk";

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

export const uploadToS3 = async (
  file: any,
  userId: number,
  folderName: string
): Promise<string> => {
  const {
    file: { filename, createReadStream },
  } = await file;
  const readStream = createReadStream();
  const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
  const { Location } = await new AWS.S3()
    .upload({
      Bucket: "instaclone-uploads-rspsang",
      Key: objectName,
      ACL: "public-read",
      Body: readStream,
    })
    .promise();
  return Location;
};

export const deleteFromS3 = async (
  fileUrl: string
): Promise<void> => {
  const decodedFileUrl: string = decodeURI(fileUrl);
  const fileKey: string = decodedFileUrl.split("amazonaws.com/")[1];
  await new AWS.S3()
    .deleteObject({
      Bucket: "instaclone-uploads-rspsang",
      Key: fileKey,
    })
    .promise();
};
