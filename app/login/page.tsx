"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/app/src/hooks/useAuth";
import { getErrorMessage } from "../src/lib/error";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const loginMutation = useLogin();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    loginMutation.mutate(
      { body: { username: email, password } },
      {
        onSuccess: () => {
          setMessage("Login successful. Your token is stored locally.");
          setEmail("");
          setPassword("");
        },
      }
    );
    router.push("/")
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-10 shadow-md">
        <h1 className="text-3xl font-semibold text-zinc-900">Sign in</h1>
        <p className="mt-2 text-sm text-zinc-600">Log in with your email and password.</p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-zinc-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-zinc-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-900 disabled:opacity-50"
          >
            {loginMutation.isPending ? "Signing in..." : "Login"}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-emerald-600">{message}</p> : null}
        {loginMutation.isError ? (
          <p className="mt-4 text-sm text-red-600">
            {getErrorMessage(loginMutation.error, "Login failed.")}
          </p>
        ) : null}

        <div className="mt-6 text-center text-sm text-zinc-600">
          Don&apos;t have an account?{" "}
          <Link className="font-semibold text-black hover:underline" href="/register">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}