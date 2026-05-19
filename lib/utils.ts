import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useAuthStore } from "@/store/auth-store"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function handleGoogleAuth(credentialResponse: { credential?: string }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BE_API}/api/v1/auth/google/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: credentialResponse.credential }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.code === 'success') {
        useAuthStore.getState().setAccessToken(result.data.accessToken);
        window.location.href = '/';
      } else {
        console.error('Google auth failed:', result.message);
        alert('Google authentication failed: ' + (result.message || 'Unknown error'));
      }
    } else {
      const errorData = await response.json();
      alert('Google authentication failed: ' + (errorData.message || 'Unknown error'));
    }
  } catch (err) {
    console.error('Network error during Google auth:', err);
    alert('Network error. Please check if the server is running.');
  }
}
