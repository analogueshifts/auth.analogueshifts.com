'use client';
import { useEffect, useState, Suspense } from 'react';
import Cookies from 'js-cookie';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppAuth } from '@/hooks/app-auth';

function LoginContent() {
  const router = useRouter();
  const token = Cookies.get('token');
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const appFromQuery = searchParams.get('app');
  const appFromCookie = Cookies.get('app');
  const selectedApp = appFromQuery || appFromCookie;
  const app =
    selectedApp && selectedApp !== 'undefined' && selectedApp !== 'null'
      ? selectedApp
      : null;

  const { login } = useAppAuth();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else if (!app) {
      router.push('/login');
    } else {
      login({ app, setLoading });
    }
  }, [app, login, router, token]);

  return (
    <main className='flex justify-center items-center h-screen w-full'>
      <span className='border-[#FFBB0A] border-x-2 w-9 h-9 rounded-full animate-spin' />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
