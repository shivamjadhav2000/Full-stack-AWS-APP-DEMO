import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({ region: 'us-east-2' }); // Replace with your region

export const handler = async (event) => {
  const filename = event.queryStringParameters.filename; // Parse filename from request body

  const bucketName = 'myawsbucket0028'; // Replace with your bucket name
  const objectKey = filename; // Construct object key
  // Construct the path of the inserted file
  const filePath = `${bucketName}/${objectKey}`;
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      ContentType: 'text/plain' // Update based on expected file types
    });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // Set expiration time

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ url: signedUrl, filePath: filePath })
    };
  } catch (err) {
    console.error('Error generating pre-signed URL:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate pre-signed URL' })
    };
  }
};


