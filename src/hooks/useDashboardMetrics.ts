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
        console.log('🔄 Buscando métricas do dashboard...');
        
        // Test basic connection first
        const { count: totalCount, error: basicError } = await supabase
          .from('occurrences')
          .select('*', { count: 'exact', head: true });

        if (basicError) {
          console.error('❌ Erro na conexão básica:', basicError);
          throw basicError;
        }

        console.log(`📊 Total de ocorrências na tabela: ${totalCount || 0}`);

        // If no data, use placeholder values
        if (!totalCount || totalCount === 0) {
          console.log('📝 Tabela vazia, usando dados de exemplo');
          setMetrics({
            whatsappTotal: 0,
            whatsappVariation: 0,
            emailTotal: 0,
            emailVariation: 0,
            sentimentAvg: 85,
            pendingTotal: 0,
          });
          return;
        }

        // Fetch actual metrics
        const fromDate = dateRange?.from?.toISOString() || '1900-01-01';
        const toDate = dateRange?.to?.toISOString() || '2100-01-01';
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        // Fetch all data with simpler queries
        const [whatsappResult, emailResult, pendingResult] = await Promise.all([
          // WhatsApp occurrences
          supabase
            .from('occurrences')
            .select('id, chat_type, created_at')
            .in('chat_type', ['group', 'private'])
            .gte('created_at', fromDate)
            .lte('created_at', toDate),
          
          // Email occurrences
          supabase
            .from('occurrences')
            .select('id, channel, created_at')
            .eq('channel', 'email')
            .gte('created_at', fromDate)
            .lte('created_at', toDate),
          
          // Pending occurrences
          supabase
            .from('occurrences')
            .select('id, status, created_at')
            .eq('status', 'Pendente')
            .gte('created_at', fromDate)
            .lte('created_at', toDate)
        ]);

        // Check for errors
        if (whatsappResult.error || emailResult.error || pendingResult.error) {
          console.error('Erros nas queries:', {
            whatsapp: whatsappResult.error,
            email: emailResult.error,
            pending: pendingResult.error
          });
          throw new Error('Erro ao buscar dados específicos');
        }

        // Calculate metrics
        const whatsappTotal = whatsappResult.data?.length || 0;
        const emailTotal = emailResult.data?.length || 0;
        const pendingTotal = pendingResult.data?.length || 0;

        // Calculate 24h variations
        const whatsapp24h = whatsappResult.data?.filter(item => 
          new Date(item.created_at) >= yesterday
        ).length || 0;

        const email24h = emailResult.data?.filter(item => 
          new Date(item.created_at) >= yesterday
        ).length || 0;

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