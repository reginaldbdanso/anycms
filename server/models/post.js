import fs from 'fs/promises';
import { POSTS_FILE } from '../config/database.js';

export async function readPosts() {
  const data = await fs.readFile(POSTS_FILE, 'utf8');
  return JSON.parse(data);
}

export async function writePosts(posts) {
  await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
}