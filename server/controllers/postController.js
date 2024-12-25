import { readPosts, writePosts } from '../models/post.js';

export async function getAllPosts(req, res) {
  try {
    const posts = await readPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
}

export async function getPost(req, res) {
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
}

export async function createPost(req, res) {
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
}

export async function updatePost(req, res) {
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
}

export async function deletePost(req, res) {
  try {
    const posts = await readPosts();
    const filteredPosts = posts.filter((p) => p.id !== req.params.id);
    await writePosts(filteredPosts);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
}