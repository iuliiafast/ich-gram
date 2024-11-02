"use client";
import axios from "axios";
import { useEffect, useState } from "react";

type PostProps = {
  postId: number;
  initialLikes: number;
};

type FeedProps = {
  posts: Array<{ id: number; imageUrl: string; description: string; likes: number }>;
  notifications: Array<{ id: number; message: string }>;
};

function Post({ postId, initialLikes }: PostProps) {
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = async () => {
    try {
      await axios.post(`/api/like`, { postId });
      setLikes(likes + 1);
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  return (
    <div>
      <button onClick={handleLike}>❤️ {likes}</button>
    </div>
  );
}

export default function FeedPage() {
  const [data, setData] = useState<FeedProps | null>(null);

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const [postsResponse, notificationsResponse] = await axios.all([
          axios.get("/api/posts"),
          axios.get("/api/notifications"),
        ]);

        setData({
          posts: postsResponse.data,
          notifications: notificationsResponse.data,
        });
      } catch (error) {
        console.error("Error loading feed data:", error);
      }
    };

    fetchFeedData();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Posts</h2>
      <div className="posts">
        {data.posts.map((post) => (
          <div key={post.id}>
            // eslint-disable-next-line react/jsx-no-undef
            <img src={post.imageUrl} alt={post.description} />
            <p>{post.description}</p>
            <Post postId={post.id} initialLikes={post.likes} />
          </div>
        ))}
      </div>

      <h2>Notifications</h2>
      <ul>
        {data.notifications.map((notification) => (
          <li key={notification.id}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
}
