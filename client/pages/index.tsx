import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../components/layout';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { IUser } from '../models/User';
import { ILevel } from '../models/Level';
import ChemicalBadge from '../components/ChemicalBadge';
import axios from 'axios';
import toast from 'react-hot-toast';
import Head from 'next/head';

const Index = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userData, setUserData] = useState<IUser | null>(null);
  const [levels, setLevels] = useState<ILevel[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('[Index Page Render] Status:', status, 'Loading State:', loading, 'UserData:', userData ? `${userData.username}/${userData.firstName}` : 'null');

  const fetchLevels = useCallback(async () => {
    console.log('[Index Page] fetchLevels called');
    setLoading(true);
    try {
      const response = await axios.get('/api/leveldata');
      let levelsData = response.data;
      console.log('[Client Index Page] Fetched levels data for UI:', JSON.stringify(levelsData, null, 2));
      if (levelsData.length < 13) {
        const filled = [...levelsData];
        for (let i = levelsData.length; i < 13; i++) {
          filled.push({
            name: `Level ${i+1}`,
            badges: [],
            backgroundUrl: '',
            order: i+1,
            availability: false
          });
        }
        levelsData = filled;
      }
      setLevels(levelsData);
      console.log('[Index Page] fetchLevels success');
    } catch (error) {
      console.error('Error fetching levels:', error);
      toast.error('Could not load levels.');
      setLevels([]);
    } finally {
      console.log('[Index Page] fetchLevels finally');
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    console.log('[Index Page] fetchUserData called. Session:', session ? 'exists' : 'null');
    if (session?.user?.telegramId) {
      setLoading(true);
      try {
        const res = await fetch('/api/user/data');
        if (!res.ok) throw new Error('Failed to fetch user data');
        const data = await res.json();
        console.log('[Index Page] UserData fetched:', data);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Could not load user data.');
        setUserData(null);
      } finally {
        setLoading(false);
        console.log('[Index Page] fetchUserData finally, setLoading(false)');
      }
    } else {
      console.log('[Index Page] fetchUserData: No session or telegramId, setLoading(false)');
      setLoading(false);
      setUserData(null);
    }
  }, [session]);

  useEffect(() => {
    console.log('[Index Page] useEffect [status, fetchUserData] triggered. Status:', status);
    if (status === 'authenticated') {
      fetchUserData();
    } else if (status === 'unauthenticated') {
      console.log('[Index Page] Status unauthenticated, redirecting to /authpage and setLoading(false).');
      setLoading(false);
      router.replace('/authpage');
    } else if (status === 'loading') {
      console.log('[Index Page] Session status is loading, ensuring setLoading(true)');
      setLoading(true);
    }
  }, [status, router, fetchUserData]);

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  console.log('[Index Page] PRE-RETURN. Status:', status, 'Loading State:', loading, 'UserData:', userData ? `${userData.username}/${userData.firstName}` : 'null');

  if (status === 'loading' || loading) {
    console.log('[Index Page] Rendering LOADING spinner.');
    return (
      <Layout>
        <Head>
          <title>Home | DGTL P2E Game</title>
        </Head>
        <div className="flex items-center justify-center h-screen w-screen bg-base-100">
          <div className="loading loading-spinner loading-lg mb-4"></div>
        </div>
      </Layout>
    );
  }

  if (!userData) {
    return (
      <Layout>
        <Head>
          <title>Home | DGTL P2E Game</title>
        </Head>
        <div className="flex items-center justify-center h-screen w-screen bg-base-100">
          <p className="text-lg text-red-500">Failed to load user data. Please try again.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Home | DGTL P2E Game</title>
      </Head>
      <div className="container mx-auto px-4 py-8 pb-24">
        {/* Main Card */}
        <div className="card bg-neutral shadow-xl mb-3">
          <div className="card-body text-white p-4">
            <h2 className="card-title text-2xl">{userData?.username || userData?.firstName || 'Player'}</h2>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats bg-neutral text-primary-content">
          <div className="stat">
            <div className="stat-title">Account balance</div>
            <div className="stat-value text-white text-3xl">{typeof userData.coins === 'number' ? userData.coins.toFixed(2) : userData.coins} GTL</div>
          </div>
          <div className="stat">
            <div className="stat-title">Level</div>
            {/* Assuming userData has a level field or you derive from levels */}
            <div className="stat-value text-white text-5xl">1</div>
          </div>
        </div>

        {/* Levels Section */}
        <div className="card bg-neutral mt-4">
          <div className="card-body p-4 text-white">
            <h2 className="card-title text-xl mb-3">Levels</h2>
            {levels.length > 0 ? (
            levels.map((level) => (
              <div 
                key={level.order} 
                className={`relative rounded-lg mb-2 shadow-inner overflow-hidden ${level.availability ? 'bg-neutral-content' : 'bg-base-100'}`
              }>
                {level.availability ? (
                  <>
                    {/* Badges */}
                    <div className="flex absolute top-2 left-2 flex-wrap gap-2 z-10">
                      {level.badges.map((badge, i) => (
                        <ChemicalBadge key={i} element={badge} />
                      ))}
                    </div>
                    
                    {/* Level background image */}
                    <img
                      src={level.menuImageUrl || level.backgroundUrl || '/default-level-bg.jpg'}
                      alt={level.name}
                      className="h-[150px] w-full object-cover"
                    />

                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-white">{level.name}</h2>
                      </div>
                      <Link href={`/game?level=${level.order}`}>
                        <button className="btn btn-md border-2 border-accent shadow-glow">Play</button>
                      </Link>
                    </div>
                  </>
                ) : (
                  /* Locked state */
                  <div className="h-[150px] flex items-center justify-center rounded-lg shadow-inner overflow-hidden bg-base-100 border-2 border-accent">
                    <span className="text-white text-xl font-bold">Locked</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-gray-500">No levels available at the moment. Please check back later.</p>
            </div>
          )}

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
