import { useState, useEffect } from 'react';
import { preloadImage } from '../lib/preloadImage';

interface Boost {
  id: string;
  imageUrl: string;
}
export function usePreloadBoosts(boosts: Boost[]) {
  const [isLoadingBoosts, setIsLoadingBoosts] = useState(true);

  useEffect(() => {
    async function loadBoosts() {
      try {
        const imagePromises = boosts.map((b) => preloadImage(b.imageUrl));
        await Promise.all(imagePromises);
        setIsLoadingBoosts(false);
      } catch (err) {
        console.error("Failed to load boost images:", err);
      }
    }

    if (boosts && boosts.length > 0) {
      loadBoosts();
    } else {
      // If no boosts provided, we're not loading anything
      setIsLoadingBoosts(false);
    }
  }, [boosts]);

  return isLoadingBoosts;
}
