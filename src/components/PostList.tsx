import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  coverImage?: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/posts');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="text-center">No posts found.</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Latest Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <Link 
                to={`/post/${post.id}`} 
                className="text-2xl font-semibold text-blue-600 hover:text-blue-800 block mb-2"
              >
                {post.title}
              </Link>
              <div 
                className="text-gray-600 mb-4 line-clamp-3"
                dangerouslySetInnerHTML={{ 
                  __html: post.content.substring(0, 150) + '...' 
                }}
              />
              <div className="flex items-center text-sm text-gray-500">
                <User size={16} className="mr-1" />
                <span className="mr-4">{post.author}</span>
                <Clock size={16} className="mr-1" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;