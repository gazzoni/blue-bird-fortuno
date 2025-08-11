'use client';

import { useState } from 'react';
import { useDashboardMetrics } from './useDashboardMetrics';
import { useOccurrenceCharts } from './useOccurrenceCharts';

export function useRefreshData() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refetch: refetchMetrics } = useDashboardMetrics();
  const { refetch: refetchCharts } = useOccurrenceCharts();

  const refreshAll = async () => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      
      // Refresh all data in parallel
      await Promise.all([
        refetchMetrics(),
        refetchCharts()
      ]);
      
      // Add a small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return { refreshAll, isRefreshing };
}