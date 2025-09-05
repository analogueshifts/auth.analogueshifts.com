'use client';
import Cookies from 'js-cookie';
import { useToast } from '@/contexts/toast';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth';
import { User } from 'lucide-react';

export default function Redirect() {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<any>(null);

  const { getUser } = useAuth();

  const searchParams = useSearchParams();
  const app = searchParams.get('app');
  const name = searchParams.get('name');
  const logo = searchParams.get('logo');
  const router = useRouter();

  const { notifyUser }: any = useToast();

  const navigate = useCallback(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    } else if (!app) {
      notifyUser('error', 'App not found');
    } else {
      Cookies.set('app', app);
      router.push(`/app-login?app=${app}`);
    }
  }, [app, router, notifyUser]);

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  const handleCancel = () => {
    router.back();
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser({ setLoading });
      if (!user) {
        notifyUser('error', 'User not found');
        Cookies.remove('token');
        router.push('/login');
      } else {
        setAccount(user);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <main className='flex justify-center items-center h-screen w-full'>
        <span className='border-[#FFBB0A] border-x-2 w-9 h-9 rounded-full animate-spin' />
      </main>
    );
  }

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      <div className='w-full max-w-md space-y-6'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <div className='flex items-center justify-center space-x-2 mb-6'>
            <div className='w-8 h-8 bg-[#FFBB0A] rounded-full flex items-center justify-center'>
              {logo ? (
                <img
                  src={logo || '/placeholder.svg'}
                  alt='App Logo'
                  className='w-8 h-8 rounded-full object-cover'
                />
              ) : (
                <span className='text-white font-bold text-sm'>
                  {(name || 'analogueshifts')[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <span className='text-xl font-semibold text-foreground'>
              {name || 'analogueshifts'}
            </span>
          </div>
          <h1 className='text-2xl font-medium text-foreground text-balance'>
            Use this account
          </h1>
          <p className='text-muted-foreground text-sm'>
            to continue to {name || 'analogueshifts'}
          </p>
        </div>

        {/* User Profile Card */}
        <Card className='border border-border hover:shadow-md transition-shadow cursor-pointer'>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-3'>
              <Avatar className='h-10 w-10'>
                <AvatarImage
                  src={
                    account?.user?.user_profile?.avatar || '/placeholder.svg'
                  }
                  alt='profile'
                />
                <AvatarFallback className='bg-muted'>
                  <User className='h-5 w-5 text-muted-foreground' />
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 min-w-0'>
                <p className='font-medium text-card-foreground truncate'>
                  {account?.user?.user_profile?.first_name}{' '}
                  {account?.user?.user_profile?.last_name}
                </p>
                <p className='text-sm text-muted-foreground truncate'>
                  {account?.user?.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Switch Account Option */}
        <div className='flex justify-center'>
          <Button
            variant='ghost'
            className='text-[#FFBB0A] hover:text-yellow-700 text-sm font-medium'
            onClick={handleLogout}
          >
            Use a different account
          </Button>
        </div>

        {/* Action Buttons */}
        <div className='flex space-x-3 pt-4'>
          <Button
            variant='outline'
            className='flex-1 border-border hover:bg-muted bg-transparent'
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className='flex-1 bg-[#FFBB0A] hover:bg-yellow-700 text-white'
            onClick={navigate}
          >
            Continue
          </Button>
        </div>

        {/* Footer */}
        <div className='text-center pt-6'>
          <p className='text-xs text-muted-foreground'>
            To continue, analogueshifts will share your name, email address, and
            profile picture with this app.
          </p>
        </div>
      </div>
    </div>
  );
}
