import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure Google Drive API
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'credentials.json'),
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// File paths for JSON storage
const POSTS_FILE = path.join(__dirname, 'data', 'posts.json');

// Ensure data directory exists
await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });

// Initialize posts file if it doesn't exist
try {
  await fs.access(POSTS_FILE);
} catch {
  await fs.writeFile(POSTS_FILE, '[]');
}

// Helper function to read posts
async function readPosts() {
  const data = await fs.readFile(POSTS_FILE, 'utf8');
  return JSON.parse(data);
}

// Helper function to write posts
async function writePosts(posts) {
  await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
}

// Upload image to Google Drive
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const fileMetadata = {
      name: file.originalname,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Specify your folder ID
    };

    const media = {
      mimeType: file.mimetype,
      body: Buffer.from(file.buffer),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    // Make the file publicly accessible
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Get the file's web view link
    const result = await drive.files.get({
      fileId: response.data.id,
      fields: 'webViewLink, webContentLink',
    });

    res.json({
      url: `https://drive.google.com/uc?export=view&id=${response.data.id}`,
      id: response.data.id,
    });
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await readPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post
app.get('/api/posts/:id', async (req, res) => {
  try {
    const posts = await readPosts();
    const post = posts.find((p) => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create post
app.post('/api/posts', async (req, res) => {
  try {
    const posts = await readPosts();
    const newPost = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
    };
    posts.push(newPost);
    await writePosts(posts);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update post
app.patch('/api/posts/:id', async (req, res) => {
  try {
    const posts = await readPosts();
    const index = posts.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }
    posts[index] = { ...posts[index], ...req.body };
    await writePosts(posts);
    res.json(posts[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const posts = await readPosts();
    const filteredPosts = posts.filter((p) => p.id !== req.params.id);
    await writePosts(filteredPosts);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
