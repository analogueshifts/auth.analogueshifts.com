'use client';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/contexts/toast';

export default function Redirect() {
  const searchParams = useSearchParams();
  const app = searchParams.get('app');
  const router = useRouter();

  const { notifyUser }: any = useToast();

  const navigate = () => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    } else {
      router.push(`/app-login?app=${app}`);
    }
  };
  useEffect(() => {
    if (app) {
      Cookies.set('app', app);
      navigate();
    } else {
      notifyUser('error', 'App not found');
    }
  }, []);
  if (!app) {
    return (
      <main className='flex justify-center items-center h-screen w-full'>
        <span className='border-red-300 border-x-2 w-9 h-9 rounded-full animate-spin' />
        <p className='text-red-500'>App not found</p>
      </main>
    );
  }
  return (
    <main className='flex justify-center items-center h-screen w-full'>
      <span className='border-green-300 border-x-2 w-9 h-9 rounded-full animate-spin' />
    </main>
  );
}
