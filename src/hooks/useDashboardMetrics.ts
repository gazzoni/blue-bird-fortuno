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

        // Fetch all data usando schema real
        const [contasPagarResult, contasReceberResult, pendingResult] = await Promise.all([
          // Contas a Pagar
          supabase
            .from('occurrences')
            .select('id, category, created_at')
            .eq('category', 'contas_a_pagar')
            .gte('created_at', fromDate)
            .lte('created_at', toDate),
          
          // Contas a Receber  
          supabase
            .from('occurrences')
            .select('id, category, created_at')
            .eq('category', 'contas_a_receber')
            .gte('created_at', fromDate)
            .lte('created_at', toDate),
          
          // Ocorrências Abertas
          supabase
            .from('occurrences')
            .select('id, status, created_at')
            .eq('status', 'aberta')
            .gte('created_at', fromDate)
            .lte('created_at', toDate)
        ]);

        // Check for errors
        if (contasPagarResult.error || contasReceberResult.error || pendingResult.error) {
          console.error('Erros nas queries:', {
            contasPagar: contasPagarResult.error,
            contasReceber: contasReceberResult.error,
            pending: pendingResult.error
          });
          throw new Error('Erro ao buscar dados específicos');
        }

        // Calculate metrics
        const contasPagarTotal = contasPagarResult.data?.length || 0;
        const contasReceberTotal = contasReceberResult.data?.length || 0;
        const pendingTotal = pendingResult.data?.length || 0;

        // Calculate 24h variations
        const contasPagar24h = contasPagarResult.data?.filter(item => 
          new Date(item.created_at) >= yesterday
        ).length || 0;

        const contasReceber24h = contasReceberResult.data?.filter(item => 
          new Date(item.created_at) >= yesterday
        ).length || 0;

        // Calculate variations (24h change)
        const contasPagarVariation = contasPagarTotal && contasPagarTotal > 0 
          ? Math.round(((contasPagar24h || 0) / contasPagarTotal) * 100) 
          : 0;
        
        const contasReceberVariation = contasReceberTotal && contasReceberTotal > 0 
          ? Math.round(((contasReceber24h || 0) / contasReceberTotal) * 100) 
          : 0;

        setMetrics({
          whatsappTotal: contasPagarTotal || 0,
          whatsappVariation: contasPagarVariation,
          emailTotal: contasReceberTotal || 0,
          emailVariation: contasReceberVariation,
          sentimentAvg: 85, // placeholder
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