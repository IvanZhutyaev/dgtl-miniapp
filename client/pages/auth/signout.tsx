import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        // Close Telegram WebApp if available
        if (window.Telegram?.WebApp) {
		  //@ts-ignore
          window.Telegram.WebApp.close();
        }
        
        // Sign out from NextAuth
        await signOut({ redirect: false });
        
        // Redirect to auth page
        router.push('/authpage');
      } catch (error) {
        console.error('Sign out error:', error);
        router.push('/authpage');
      }
    };

    handleSignOut();
  }, [router]);

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral rounded-lg shadow-xl p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Signing Out</h2>
          <p className="text-gray-300 mb-6">
            Please wait while we sign you out...
          </p>
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    </div>
  );
} 