import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../components/layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { IUser } from '../models/User';

const Index = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/user/data');
        if (!res.ok) throw new Error('Failed to fetch user data');
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchUserData();
    } else if (status === 'unauthenticated') {
      setLoading(false);
      router.replace('/authpage'); // Redirect if unauthenticated
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-base-100">
        <div className="loading loading-spinner loading-lg mb-4"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-base-100">
        <p className="text-lg text-red-500">Failed to load user data. Please try again.</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col min-h-screen p-3">
        {/* Main Card */}
        <div className="card bg-neutral shadow-xl mb-3">
          <div className="card-body text-white p-4">
            <h2 className="card-title text-2xl">{session?.user.username || 'Unknown User'}</h2>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats bg-neutral text-primary-content">
          <div className="stat">
            <div className="stat-title">Account balance</div>
            <div className="stat-value text-white text-3xl">{userData.coins} GTL</div>
          </div>
          <div className="stat">
            <div className="stat-title">Level</div>
            <div className="stat-value text-white text-5xl">1</div>
          </div>
        </div>

        {/* Levels Section */}
        <div className="card bg-neutral mt-4">
          <div className="card-body p-4 text-white">
            <h2 className="card-title text-xl mb-3">Levels</h2>

            {/* Example Level */}
            <div className="relative bg-neutral-content rounded-lg mb-2 shadow-inner overflow-hidden">
              <div className="flex absolute top-2 left-2 flex-wrap gap-2 z-10">
                <div className="badge badge-outline">Au</div>
                <div className="badge badge-outline">Fe</div>
                <div className="badge badge-outline">C</div>
                <div className="badge badge-outline">Br</div>
              </div>

              <img
                src="/level1-bg.png"
                alt="Level 1"
                className="h-[150px] w-full object-cover"
              />

              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Level 1</h2>
                  <p className="text-m font-bold">{userData?.tickets || 0} ⛏</p>
                </div>
                <Link href="/game">
                  <button className="btn btn-md border-2 border-accent shadow-glow">Play</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
