// app/login/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [error, setError] = useState("");
  const { status } = useSession();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.error) {
      setError(res.error as string);
    }
    if (res?.ok) {
      router.push("/");
    }
  };
  const showSession = () => {
    if (status === "authenticated") {
      window.location.href = "/";
    } else if (status === "loading") {
      return <span className="text-[#888] text-sm mt-7">Loading...</span>;
    } else {
      return (
        <section className="w-full h-screen flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="p-6 w-full max-w-[400px] flex flex-col justify-between items-center gap-2 border border-solid border-black bg-white rounded"
          >
            <h1 className="text-2xl font-semibold mb-4">Login</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="w-full">
              <label htmlFor="email" className="block mb-1 text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="w-full">
              <label htmlFor="password" className="block mb-1 text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Log In
            </button>
            <p className="mt-4">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-500 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </section>
      );
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {showSession()}
    </main>
  );
}
