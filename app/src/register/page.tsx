"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { register } from "@/app/src/api/auth";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setError(null);

    try {
      const data = await register(email, password);
      setStatus(`Registered ${data.email} successfully. You can now log in.`);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-10 shadow-md">
        <h1 className="text-3xl font-semibold text-zinc-900">Create an account</h1>
        <p className="mt-2 text-sm text-zinc-600">Register with your email and password.</p>

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
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-900"
          >
            Register
          </button>
        </form>

        {status ? <p className="mt-4 text-sm text-emerald-600">{status}</p> : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <div className="mt-6 text-center text-sm text-zinc-600">
          Already have an account?{' '}
          <Link className="font-semibold text-black hover:underline" href="/src/login">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
