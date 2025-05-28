import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


const AuthPage = () => {
  const { status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      console.log('Authentication status:', status);
      if (status === 'unauthenticated') {
        console.log('Unauthenticated user.');
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          const initDataRaw = window.Telegram.WebApp.initData;
          if (initDataRaw) {
            try {
              console.log('Attempting signIn with initDataRaw:', initDataRaw);
              const result = await signIn('credentials', { initData: initDataRaw, redirect: false });
              if (result?.error) {
                console.error('SignIn error:', result.error);
                setError(result.error);
              } else {
                console.log('SignIn successful:', result);
              }
            } catch (err) {
              console.error('SignIn failed:', err);
              setError('SignIn failed. Please try again.');
            }
          } else {
            window.location.href = '/auth/error1';
          }
        } else {
          window.location.href = '/auth/error2';
        }
      } else if (status === 'authenticated') {
        router.push('/');
      }
    };

    if (status === 'unauthenticated' || status === 'authenticated') {
      authenticate();
    }
  }, [status]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-base-100">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen w-screen bg-base-100">
    <div className="loading loading-spinner loading-lg mb-4"></div>
  </div>
  
  } 

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-base-100">
      <div className="loading loading-spinner loading-lg mb-4"></div>
    </div>
  );
};

export default AuthPage;
