import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import PeriodicTable from '../components/PeriodicTable';

const PeriodicTablePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [collectedMinerals, setCollectedMinerals] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollectedMinerals = async () => {
      try {
        const res = await fetch('/api/user/collected-minerals');
        if (!res.ok) throw new Error('Failed to fetch collected minerals');
        const data = await res.json();
        setCollectedMinerals(data.minerals || []);
      } catch (error) {
        console.error('Error fetching collected minerals:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchCollectedMinerals();
    } else if (status === 'unauthenticated') {
      router.replace('/authpage');
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen w-screen bg-base-100">
          <div className="loading loading-spinner loading-lg mb-4"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-base-100">
        <PeriodicTable collectedMinerals={collectedMinerals} />
      </div>
    </Layout>
  );
};

export default PeriodicTablePage; 