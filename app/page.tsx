import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-4xl rounded-3xl border border-zinc-200 bg-white p-10 shadow-lg">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Image src="/next.svg" alt="App logo" width={40} height={40} />
              <div>
                <h1 className="text-4xl font-semibold text-zinc-900">Gyani Auth</h1>
                <p className="text-sm text-zinc-600">Register and login with the FastAPI backend.</p>
              </div>
            </div>

            <p className="max-w-xl text-base leading-7 text-zinc-700">
              Use the authentication pages to create an account and sign in. After successful login,
              your token is stored locally and can be used for future authenticated requests.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/src/register"
                className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-900"
              >
                Register
              </Link>
              <Link
                href="/src/login"
                className="inline-flex items-center justify-center rounded-2xl border border-zinc-900 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-zinc-950 p-8 text-white shadow-2xl">
            <h2 className="text-xl font-semibold">Development notes</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
              <li>• Server auth endpoints: <code>/auth/register</code>, <code>/auth/login</code></li>
              <li>• Client API base URL: <code>http://localhost:8000</code></li>
              <li>• Login stores token in <code>localStorage.auth_token</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
