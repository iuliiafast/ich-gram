import { useState } from "react";
import { $api } from "../api/api";

export const LoginForm = () => {
  const [userObject, setUserObject] = useState({ email: "", password: "" });
  const handleSubmit = (e: any) => {
    e.preventDefault();
    $api.post("/auth/login", userObject);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={(e) =>
          setUserObject({ ...userObject, email: e.target.value })
        }
        type="email"
      />
      <input
        onChange={(e) =>
          setUserObject({ ...userObject, password: e.target.value })
        }
        type="password"
      />
      <button>Login</button>
    </form>
  );
};