import { client } from "@/app/src/api/generated/client.gen";

client.setConfig({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  auth: () => {
    if (typeof window === "undefined") return undefined;
    return localStorage.getItem("access_token") ?? undefined;
  },
});