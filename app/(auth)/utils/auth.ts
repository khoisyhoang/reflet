import { useAuthStore } from '@/store/auth-store';
import { redirect } from 'next/navigation';

export const checkAuth = async (accessToken: string, redirectTo = '/') => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BE_API}/api/v1/auth/check-auth`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
  });
  const result = await response.json();
  if (result.code !== 'success') {
    useAuthStore.getState().logout();
    redirect(`/login?r=${redirectTo}`);
  }
  
  
};