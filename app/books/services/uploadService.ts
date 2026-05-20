import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.NEXT_PUBLIC_AWS_S3_BUCKET!;

export async function uploadEpubToS3(file: File, key: string): Promise<{ code: 'success' | 'error'; message: string; data: { url: string | null } }> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: 'application/epub+zip',
  });
  try {
    await s3.send(command);
  } catch (error) {
    console.error(error);
    return {
      code: 'error',
      message: 'Failed to upload file',
      data: {
        url: null,
      },
    }
  }
  return {
    code: 'success',
    message: 'File uploaded successfully',
    data: {
      url: `https://${BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`,
    },
  }
}
