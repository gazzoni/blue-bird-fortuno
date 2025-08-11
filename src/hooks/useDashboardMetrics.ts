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


      try {
        // Fetch WhatsApp occurrences (chat_type IN ('group', 'private'))
        const { count: whatsappTotal, error: whatsappError } = await supabase
          .from('occurrences')
          .select('*', { count: 'exact', head: true })
          .in('chat_type', ['group', 'private'])
          .gte('created_at', dateRange?.from?.toISOString() || '1900-01-01')
          .lte('created_at', dateRange?.to?.toISOString() || '2100-01-01');

        // Fetch WhatsApp occurrences last 24h
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const { count: whatsapp24h, error: whatsapp24hError } = await supabase
          .from('occurrences')
          .select('*', { count: 'exact', head: true })
          .in('chat_type', ['group', 'private'])
          .gte('created_at', yesterday.toISOString());

        // Fetch Email occurrences
        const { count: emailTotal, error: emailError } = await supabase
          .from('occurrences')
          .select('*', { count: 'exact', head: true })
          .eq('channel', 'email')
          .gte('created_at', dateRange?.from?.toISOString() || '1900-01-01')
          .lte('created_at', dateRange?.to?.toISOString() || '2100-01-01');

        // Fetch Email occurrences last 24h
        const { count: email24h, error: email24hError } = await supabase
          .from('occurrences')
          .select('*', { count: 'exact', head: true })
          .eq('channel', 'email')
          .gte('created_at', yesterday.toISOString());

        // Fetch Pending occurrences
        const { count: pendingTotal, error: pendingError } = await supabase
          .from('occurrences')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Pendente')
          .gte('created_at', dateRange?.from?.toISOString() || '1900-01-01')
          .lte('created_at', dateRange?.to?.toISOString() || '2100-01-01');

        // Check for errors
        if (whatsappError || whatsapp24hError || emailError || email24hError || pendingError) {
          console.error('Supabase errors:', { whatsappError, whatsapp24hError, emailError, email24hError, pendingError });
          throw new Error('Erro ao buscar dados do Supabase');
        }

        // Calculate variations (24h change)
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
          sentimentAvg: 85, // placeholder - would need sentiment analysis
          pendingTotal: pendingTotal || 0,
        });
      } catch (supabaseError) {
        console.error('Erro nas queries Supabase:', supabaseError);
        // Fallback to mock data if Supabase fails
        setMetrics({
          whatsappTotal: 0,
          whatsappVariation: 0,
          emailTotal: 0,
          emailVariation: 0,
          sentimentAvg: 85,
          pendingTotal: 0,
        });
      }
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