import { uploadFile } from '../services/driveService.js';

export async function handleFileUpload(req, res) {
  try {
    // console.log('File on the request object',req.file)
    const fileId = await uploadFile(req.file);
    
    res.json({
      url: `https://drive.google.com/uc?export=view&id=${fileId}`,
      id: fileId,
    });
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    res.status(500).json({ error: 'Failed to upload file to Google Drive' });
  }
}