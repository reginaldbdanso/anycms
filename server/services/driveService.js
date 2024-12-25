import { drive } from '../config/drive.js';
import streamifier from 'streamifier';

export async function uploadFile(fileData) {
  try {
    const fileMetadata = {
      name: fileData.originalname,
      mimeType: fileData.mimetype
    };

    const media = {
      mimeType: fileData.mimetype,
      body: streamifier.createReadStream(fileData.buffer)
    };
    console.log('\n\n We were able to reach here \n\n')
    // console.log('\n\n We logged  the drive object \n\n', drive)

    // Upload file to Google Drive
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    });

    // Make the file publicly accessible
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    return response.data.id;
  } catch (error) {
    console.error('Google Drive upload error:', error);
    throw new Error('Failed to upload file to Google Drive');
  }
}