// components/PostFeed.tsx
import React from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  image?: string; // URL изображения, если есть
  createdAt: string;
}

interface PostFeedProps {
  posts: Post[];
}

const PostFeed: React.FC<PostFeedProps> = ({ posts }) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
          {post.image && (
            <img src={post.image} alt="Post image" className="w-full h-auto rounded mb-2" />
          )}
          <h2 className="text-lg font-bold">{post.title}</h2>
          <p className="text-sm text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</p>
          <p className="mt-2 text-gray-800">{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default PostFeed;
