import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Validate credentials file exists
const credentialsPath = path.join(__dirname, '..', 'credentials.json');
if (!fs.existsSync(credentialsPath)) {
    throw new Error('Credentials file not found. Please ensure credentials.json exists.');
}

// Load the credentials
const serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));

// Create a new JWT client using the service account
const auth = new google.auth.JWT(
    serviceAccount.client_email,  // Referenced from the JSON file
    null,                         // No key file path, using direct private key
    serviceAccount.private_key,   // Referenced from the JSON file
    ['https://www.googleapis.com/auth/drive.file'] // Scope for accessing Google Drive
);

// console.log('Auth object \n\n\n', auth)
// Create drive client with retry and error handling
const drive = google.drive({ version: 'v3', auth });

// Example function to verify authentication and list Google Drive files
async function listDriveFiles() {
    const drive = google.drive({ version: 'v3', auth });

    try {
        const response = await drive.files.list({
            pageSize: 10,
            fields: 'files(id, name)',
        });
        console.log('Files:', response.data.files);
    } catch (error) {
        console.error('Error accessing Google Drive:', error.message);
    }
}

// Call the example function
console.log('\n\n Trying to list drive files \n\n\n');

listDriveFiles();

export { drive };