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

  let app;
  if (!searchParams.has('app')) {
    app = Cookies.get('app');
  } else {
    app = searchParams.get('app');
  }

  const { login } = useAppAuth();

  useEffect(() => {
    if (!token || !app) {
      router.push(`/?app=${app}`);
    } else {
      login({ app, setLoading });
    }
  }, []);

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
