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
        <h3>{post.user_name}</h3>
        <p>{post.caption}</p>
        <div>
          <span>Likes: {post.likes_count}</span>
          <span>Comments: {post.comments_count}</span>
        </div>
      </div>
      <Image src=
        {post.image_url} alt=
        {post.caption}
      />
      {post.profile_image &&
        <Image src=
          {post.profile_image} alt=
          "Profile" />}
    </>
  );
};

export default PostComponent;