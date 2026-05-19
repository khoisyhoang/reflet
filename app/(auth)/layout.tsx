import { GoogleAuthProvider } from '@/app/(auth)/providers';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <GoogleAuthProvider>{children}</GoogleAuthProvider>;
}
