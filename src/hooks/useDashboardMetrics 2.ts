'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface DashboardMetrics {
  whatsappTotal: number;
  whatsappVariation: number;
  emailTotal: number;
  emailVariation: number;
  sentimentAvg: number;
  pendingTotal: number;
}

export function useDashboardMetrics(dateRange?: { from?: Date; to?: Date }) {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    whatsappTotal: 0,
    whatsappVariation: 0,
    emailTotal: 0,
    emailVariation: 0,
    sentimentAvg: 85, // placeholder
    pendingTotal: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, use mock data since we don't have the actual database
      // In a real implementation, these would be actual Supabase queries
      
      // Generate mock data based on date range (simulate filtering effect)
      const rangeDays = dateRange?.from && dateRange?.to 
        ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) 
        : 7;
      
      // Simulate data scaling based on period length
      const scaleFactor = Math.max(0.3, Math.min(2, rangeDays / 7));
      
      const whatsappTotal = Math.floor(156 * scaleFactor);
      const whatsapp24h = Math.floor(23 * Math.random() * 2); // Some variation for 24h
      const emailTotal = Math.floor(42 * scaleFactor);
      const email24h = Math.floor(8 * Math.random() * 2);
      const pendingTotal = Math.floor(7 + Math.random() * 5);

      // Calculate variations (24h change)
      const whatsappVariation = whatsappTotal > 0 
        ? Math.round((whatsapp24h / whatsappTotal) * 100) 
        : 0;
      
      const emailVariation = emailTotal > 0 
        ? Math.round((email24h / emailTotal) * 100) 
        : 0;

      setMetrics({
        whatsappTotal,
        whatsappVariation,
        emailTotal,
        emailVariation,
        sentimentAvg: 85, // placeholder
        pendingTotal,
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