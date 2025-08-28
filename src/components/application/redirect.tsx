'use client';
import Cookies from 'js-cookie';
import { useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/contexts/toast';

export default function Redirect() {
  const searchParams = useSearchParams();
  const app = searchParams.get('app');
  const router = useRouter();

  const { notifyUser }: any = useToast();

  const navigate = useCallback(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    } else {
      router.push(`/app-login?app=${app}`);
    }
  }, [app, router]);

  useEffect(() => {
    if (app) {
      Cookies.set('app', app);
      navigate();
    } else {
      notifyUser('error', 'App not found');
    }
  }, []);

  if (!app) {
    const handleRetry = () => {
      window.location.reload();
    };

    return (
      <main className='flex flex-col justify-center items-center h-screen w-full'>
        <p className='text-red-500 mb-4'>App not found</p>
        <button
          onClick={handleRetry}
          className='px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition'
        >
          Retry
        </button>
      </main>
    );
  }

  return (
    <main className='flex justify-center items-center h-screen w-full'>
      <span className='border-green-300 border-x-2 w-9 h-9 rounded-full animate-spin' />
    </main>
  );
}
