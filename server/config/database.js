import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_FILE = path.join(__dirname, '..', 'data', 'posts.json');

// Ensure data directory exists
await fs.mkdir(path.join(__dirname, '..', 'data'), { recursive: true });

// Initialize posts file if it doesn't exist
try {
  await fs.access(POSTS_FILE);
} catch {
  await fs.writeFile(POSTS_FILE, '[]');
}

export { POSTS_FILE };