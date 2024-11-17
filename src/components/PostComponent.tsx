"use client";
import React from "react";
import { Post } from "../utils/types";
import Image from "next/image";

interface PostProps {
  post: Post;
}

const PostComponent: React.FC<PostProps> = ({ post }) => {
  return (
    <>
      <div>
        <h3>{post.userName}</h3>
        <p>{post.caption}</p>
        <div>
          <span>Likes: {post.likesCount}</span>
          <span>Comments: {post.commentsCount}</span>
        </div>
      </div>
      <Image src=
        {post.imageUrl} alt=
        {post.caption}
      />
      {post.avatar &&
        <Image src=
          {post.avatar} alt=
          "Profile" />}
    </>
  );
};

export default PostComponent;