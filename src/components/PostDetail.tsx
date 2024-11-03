import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  coverImage?: string;
}

const PostDetail: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to fetch post. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (!post) {
    return <div className="text-center">Post not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="text-blue-600 hover:text-blue-800 mb-8 inline-block">&larr; Back to Posts</Link>
      <article className="bg-white shadow-lg rounded-lg overflow-hidden">
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-[400px] object-cover"
          />
        )}
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <User size={16} className="mr-1" />
            <span className="mr-4">{post.author}</span>
            <Clock size={16} className="mr-1" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </div>
  );
};

export default PostDetail;