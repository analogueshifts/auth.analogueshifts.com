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
  return <main></main>;
}
