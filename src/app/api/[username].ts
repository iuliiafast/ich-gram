import { GetServerSideProps } from "next";
import axios from "axios";

type ProfileProps = {
  user: {
    username: string;
    bio: string;
    posts: Array<{ id: number; imageUrl: string; description: string }>;
  };
};

export default function ProfilePage({ user }: ProfileProps) {
  return (
    <div>
      <h1>{user.username}</h1>
      <p>{user.bio}</p>
      <div className="posts">
        {user.posts.map((post) => (
          <div key={post.id}>
            <img src={post.imageUrl} alt={post.description} />
            <p>{post.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username } = context.params!;
  const cookies = context.req.headers.cookie;
  const token = cookies ? parse(cookies).token : null;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      props: { user: response.data },
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      notFound: true,
    };
  }
};
