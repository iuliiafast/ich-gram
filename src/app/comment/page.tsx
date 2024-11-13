"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Comment {
  _id: string;
  post_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
}

interface CommentPageProps {
  postId: string;
}

const CommentPage: React.FC<CommentPageProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/posts/${postId}/comments`);
        setComments(response.data);
      } catch (err) {
        setError("Не удалось загрузить комментарии");
        console.error(err);
      }
    };

    fetchComments();
  }, [postId]);

  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      setError("Комментарий не может быть пустым");
      return;
    }

    try {
      const response = await axios.post(`/api/posts/${postId}/comments`, {
        comment_text: newComment,
      });
      setComments([...comments, response.data]);
      setNewComment("");
      setError(null);
    } catch (err) {
      setError("Ошибка при создании комментария");
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (err) {
      setError("Ошибка при удалении комментария");
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Комментарии</h1>

      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Comment list */}
      <div className="mb-4">
        {comments.map((comment) => (
          <div key={comment._id} className="border-b border-gray-300 py-2">
            <p className="text-sm text-gray-500">{comment.created_at}</p>
            <p className="font-semibold">{comment.user_id}</p>
            <p>{comment.comment_text}</p>
            <button
              onClick={() => handleDeleteComment(comment._id)}
              className="text-red-500 text-sm"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>

      {/* Add new comment */}
      <div className="flex flex-col">
        <textarea
          placeholder="Добавьте комментарий"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="border border-gray-300 p-2 rounded mb-2"
        />
        <button
          onClick={handleCreateComment}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default CommentPage;
