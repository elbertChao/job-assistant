import { supabase } from "../lib/supabase";

const API_BASE = "http://localhost:8000/api";

// Unified fetch utility with token
export const fetchWithToken = async (url: string, options: RequestInit = {}) => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    throw new Error("User not authenticated");
  }

  const token = session.access_token;

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Request failed");
  }

  return response.json();
};

// create user using fetchWithToken
export async function createUser(fullName: string) {
  const { data: sessionData } = await supabase.auth.getSession()
  const accessToken = sessionData.session?.access_token
  const user = sessionData.session?.user

  if (!accessToken || !user) {
    console.error("Missing access token or user")
    return null
  }

  const payload = {
    id: user.id, // required for your FastAPI schema
    email: user.email ?? "", // fallback to empty string just in case
    full_name: fullName,
    avatar_url: user.user_metadata?.avatar_url ?? null,
  }

  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Failed to create user: ${res.status} ${errText}`)
    }

    return await res.json()
  } catch (err) {
    console.error("Error in createUser:", err)
    return null
  }
}

export const getUser = async (id: string) =>
  fetch(`${API_BASE}/users/${id}`).then(res => res.json());

export const analyzeResume = async (resumeData: any) => {
  return await fetchWithToken(`${API_BASE}/resume/analyze`, {
    method: "POST",
    body: JSON.stringify(resumeData),
  });
};

export const generateAnswer = async (data: any) =>
  fetch(`${API_BASE}/generate/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res.json());
