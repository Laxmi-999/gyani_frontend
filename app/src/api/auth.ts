const SERVER_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type RegisterResponse = {
  id: number;
  email: string;
  created_at: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

async function parseError(response: Response) {
  let errorMessage = response.statusText;
  try {
    const data = await response.json();
    if (data?.detail) errorMessage = data.detail;
  } catch {
    // ignore parse failure
  }
  return errorMessage;
}

export async function register(email: string, password: string): Promise<RegisterResponse> {
  const response = await fetch(`${SERVER_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${SERVER_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: email, password }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}
