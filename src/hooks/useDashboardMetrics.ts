'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface DashboardMetrics {
  totalOccurrences: number;
  totalVariation: number;
  dailyAverage: number;
  averageVariation: number;
  sentimentAvg: number;
  churnRisk: number; // mock percentage until column exists
}

export function useDashboardMetrics(dateRange?: { from?: Date; to?: Date }) {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalOccurrences: 0,
    totalVariation: 0,
    dailyAverage: 0,
    averageVariation: 0,
    sentimentAvg: 85, // mock placeholder until DB column exists
    churnRisk: 12, // mock placeholder until DB column exists
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use date range if provided, otherwise use default last 7 days
      const now = new Date();
      const defaultFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const fromDate = dateRange?.from || defaultFrom;
      const toDate = dateRange?.to || now;

      const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const fromDateISO = fromDate.toISOString();
      const toDateISO = toDate.toISOString();

      // Total occurrences in the period
      const [{ count: totalOccurrences, error: e1 }, { count: total24h, error: e2 }] = await Promise.all([
        supabase
          .from('new-occurrences')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', fromDateISO)
          .lte('created_at', toDateISO),
        supabase
          .from('new-occurrences')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', since24h),
      ]);

      if (e1 || e2) throw e1 || e2;

      // Calculate daily average
      const periodDays = Math.max(1, Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)));
      const dailyAverage = totalOccurrences ? Math.round((totalOccurrences / periodDays) * 10) / 10 : 0;

      // Calculate variations (compared to last 24h)
      const totalVariation = totalOccurrences && totalOccurrences > 0
        ? Math.round(((total24h || 0) / totalOccurrences) * 100)
        : 0;

      // For daily average variation, compare today's average vs yesterday's
      const yesterday = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
      const { count: yesterday24h } = await supabase
        .from('new-occurrences')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', yesterday)
        .lt('created_at', since24h);

      const averageVariation = yesterday24h && yesterday24h > 0
        ? Math.round(((total24h || 0) - yesterday24h) / yesterday24h * 100)
        : 0;

      setMetrics({
        totalOccurrences: totalOccurrences || 0,
        totalVariation,
        dailyAverage,
        averageVariation,
        sentimentAvg: 85, // mock placeholder
        churnRisk: 12, // mock placeholder
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [dateRange]); // eslint-disable-line react-hooks/exhaustive-deps

  return { metrics, loading, error, refetch: fetchMetrics };
}