import { useState, useCallback } from 'react';

export default function PullToRefresh(fetchData) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData(); // Call the screen's fetch function
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  return { refreshing, onRefresh };
}
