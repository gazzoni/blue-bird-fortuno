'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface DashboardMetrics {
  whatsappTotal: number;
  whatsappVariation: number;
  emailTotal: number;
  emailVariation: number;
  sentimentAvg: number;
  churnRisk: number; // mock percentage until column exists
}

export function useDashboardMetrics(dateRange?: { from?: Date; to?: Date }) {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    whatsappTotal: 0,
    whatsappVariation: 0,
    emailTotal: 0,
    emailVariation: 0,
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

      // WhatsApp occurrences: chat_type in ('group','private') filtered by date range
      const [{ count: whatsappTotal, error: e1 }, { count: whatsapp24h, error: e2 }] = await Promise.all([
        supabase
          .from('occurrences')
          .select('id', { count: 'exact', head: true })
          .in('chat_type', ['group', 'private'])
          .gte('created_at', fromDateISO)
          .lte('created_at', toDateISO),
        supabase
          .from('occurrences')
          .select('id', { count: 'exact', head: true })
          .in('chat_type', ['group', 'private'])
          .gte('created_at', since24h),
      ]);

      if (e1 || e2) throw e1 || e2;

      // Email occurrences: channel = 'email' filtered by date range
      const [{ count: emailTotal, error: e3 }, { count: email24h, error: e4 }] = await Promise.all([
        supabase
          .from('occurrences')
          .select('id', { count: 'exact', head: true })
          .eq('channel', 'email')
          .gte('created_at', fromDateISO)
          .lte('created_at', toDateISO),
        supabase
          .from('occurrences')
          .select('id', { count: 'exact', head: true })
          .eq('channel', 'email')
          .gte('created_at', since24h),
      ]);

      if (e3 || e4) throw e3 || e4;

      const whatsappVariation = whatsappTotal && whatsappTotal > 0
        ? Math.round(((whatsapp24h || 0) / whatsappTotal) * 100)
        : 0;
      const emailVariation = emailTotal && emailTotal > 0
        ? Math.round(((email24h || 0) / emailTotal) * 100)
        : 0;

      setMetrics({
        whatsappTotal: whatsappTotal || 0,
        whatsappVariation,
        emailTotal: emailTotal || 0,
        emailVariation,
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