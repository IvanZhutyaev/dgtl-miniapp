import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  useEffect(() => {
    // Log the error for debugging
    if (error) {
      console.error('Authentication error:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral rounded-lg shadow-xl p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Error</h2>
          <p className="text-gray-300 mb-6">
            {error === 'Configuration'
              ? 'There is a problem with the server configuration.'
              : error === 'AccessDenied'
              ? 'Access denied. You do not have permission to view this page.'
              : error === 'Verification'
              ? 'Could not verify Telegram data. Please try again.'
              : 'An unexpected error occurred during authentication.'}
          </p>
          <button
            onClick={() => router.push('/authpage')}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
} 