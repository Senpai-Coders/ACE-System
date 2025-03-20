import { Readable } from "stream";
import { Upload } from "@aws-sdk/lib-storage";

import { TFolderUploadGroups } from "@/types";
import s3Client, { getS3BaseURL } from "@/lib/aws-s3";

export const uploadFile = async (
    file: Buffer | Readable,
    fileName: string,
    folder: TFolderUploadGroups,
    type?: string
) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${folder}/${fileName}`,
        Body: file,
        ContentType: type,
    };

    const upload = new Upload({
        client: s3Client,
        params,
        leavePartsOnError: false,
    });

    await upload.done();
    return `${getS3BaseURL()}${params.Key}`;
};

// import { Readable } from "stream";
// import { PutObjectCommand } from "@aws-sdk/client-s3";

// import { TFolderUploadGroups } from "@/types";
// import s3Client, { getS3BaseURL } from "@/lib/aws-s3";

// export const uploadFile = async (
//     file: Buffer | Readable, // Accept both Buffer and Readable stream
//     fileName: string,
//     folder: TFolderUploadGroups,
//     type?: string
// ) => {
//     const params = {
//         Bucket: process.env.AWS_S3_BUCKET_NAME,
//         Key: `${folder}/${fileName}`,
//         Body: file, // Directly use file (Buffer or Readable stream)
//         ContentType: type,
//     };

//     const command = new PutObjectCommand(params);
//     await s3Client.send(command);

//     return `${getS3BaseURL()}${params.Key}`;
// };
