import { useState, useEffect } from 'react';
import { mineralService } from '../services/mineralService';

const CollectedMinerals = ({ userId }) => {
  const [minerals, setMinerals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMinerals = async () => {
      try {
        setLoading(true);
        const response = await mineralService.getUserMinerals(userId);
        setMinerals(response.minerals);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMinerals();
    }
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!minerals.length) return <div>No minerals collected yet</div>;

  // Группируем минералы по atomicNumber
  const groupedMinerals = minerals.reduce((acc, mineral) => {
    if (!acc[mineral.atomicNumber]) {
      acc[mineral.atomicNumber] = [];
    }
    acc[mineral.atomicNumber].push(mineral);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Collected Minerals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedMinerals).map(([atomicNumber, levels]) => (
          <div key={atomicNumber} className="bg-white rounded-lg shadow p-4">
            <h3 className="text-xl font-semibold mb-2">
              Element {atomicNumber}
            </h3>
            <div className="space-y-2">
              {levels.map((mineral) => (
                <div key={mineral._id} className="flex justify-between items-center">
                  <span>Level {mineral.levelId}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(mineral.collectedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectedMinerals; 