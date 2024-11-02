"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFoundPage() {
  const router = useRouter();

  useEffect(() => {
    // Optionally redirect to home after a delay, e.g., 5 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, [router]);

  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <p>You will be redirected to the homepage shortly, or click the button below.</p>
      <button onClick={() => router.push("/")}>Go to Homepage</button>
    </div>
  );
}
