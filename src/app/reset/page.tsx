"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for routing in Next.js 13+
import axios from "axios";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      // Call your reset password API endpoint
      const response = await axios.post("/api/reset-password", { email });
      setMessage(response.data.message || "Check your email for reset instructions.");
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit} className="reset-password-form">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Send Reset Link"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
