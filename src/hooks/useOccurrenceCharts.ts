'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ChartDataPoint {
  date: string;
  total: number;
}

export interface StatusDataPoint {
  status: string;
  total: number;
}

export interface RecentOccurrence {
  id: number;
  created_at: string;
  category: string;
  chat_name: string;
  status: string;
  chat_type: string;
}

export function useOccurrenceCharts(dateRange?: { from?: Date; to?: Date }) {
  const [lineChartData, setLineChartData] = useState<ChartDataPoint[]>([]);
  const [pieChartData, setPieChartData] = useState<StatusDataPoint[]>([]);
  const [recentOccurrences, setRecentOccurrences] = useState<RecentOccurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);

      try {
        const fromDate = dateRange?.from?.toISOString() || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const toDate = dateRange?.to?.toISOString() || new Date().toISOString();

        // Fetch occurrences by day for line chart using regular query
        const { data: rawData, error: rawError } = await supabase
          .from('occurrences')
          .select('created_at')
          .gte('created_at', fromDate)
          .lte('created_at', toDate)
          .order('created_at');

        let formattedLineData: ChartDataPoint[] = [];
        if (!rawError && rawData) {
          // Group by date manually
          const dateGroups: { [key: string]: number } = {};
          rawData.forEach(item => {
            const date = new Date(item.created_at).toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: '2-digit' 
            });
            dateGroups[date] = (dateGroups[date] || 0) + 1;
          });

          formattedLineData = Object.entries(dateGroups)
            .map(([date, total]) => ({ date, total }))
            .sort((a, b) => {
              // Sort by date
              const [dayA, monthA] = a.date.split('/');
              const [dayB, monthB] = b.date.split('/');
              const dateA = new Date(2024, parseInt(monthA) - 1, parseInt(dayA));
              const dateB = new Date(2024, parseInt(monthB) - 1, parseInt(dayB));
              return dateA.getTime() - dateB.getTime();
            });
        } else {
          console.error('Erro ao buscar dados para gráfico de linha:', rawError);
        }

        // Fetch occurrences by status for pie chart
        const { data: pieData, error: pieError } = await supabase
          .from('occurrences')
          .select('status')
          .gte('created_at', fromDate)
          .lte('created_at', toDate);

        let formattedPieData: StatusDataPoint[] = [];
        if (!pieError && pieData) {
          const statusLabel: Record<string, string> = {
            aberta: 'Pendente',
            resolvida: 'Concluído',
            urgente: 'Em Andamento',
          };
          const statusGroups: { [key: string]: number } = {};
          pieData.forEach(item => {
            const raw = item.status || 'sem_status';
            const label = statusLabel[raw] ?? raw;
            statusGroups[label] = (statusGroups[label] || 0) + 1;
          });

          formattedPieData = Object.entries(statusGroups).map(([status, total]) => ({ status, total }));
        }

        // Fetch recent occurrences usando campos reais
        const { data: recentData } = await supabase
          .from('occurrences')
          .select('id, created_at, chat_name, status, category, justification, chat_type')
          .gte('created_at', fromDate)
          .lte('created_at', toDate)
          .order('created_at', { ascending: false })
          .limit(5);

        const chatTypeLabel: Record<string, string> = {
          group: 'Grupo',
          private: 'Privado',
        };
        const statusLabelRecent: Record<string, string> = {
          aberta: 'Pendente',
          resolvida: 'Concluído',
          urgente: 'Em Andamento',
        };
        const formattedRecentData = recentData?.map(item => ({
          id: item.id,
          created_at: item.created_at,
          category: item.category || 'Sem Categoria',
          chat_name: item.chat_name || '—',
          status: statusLabelRecent[item.status as keyof typeof statusLabelRecent] ?? (item.status || 'Sem Status'),
          chat_type: chatTypeLabel[item.chat_type as keyof typeof chatTypeLabel] ?? (item.chat_type || '—'),
        })) || [];

        setLineChartData(formattedLineData);
        setPieChartData(formattedPieData);
        setRecentOccurrences(formattedRecentData);

      } catch (supabaseError) {
        console.error('Erro ao buscar dados dos gráficos:', supabaseError);
        // Fallback to empty data
        setLineChartData([]);
        setPieChartData([]);
        setRecentOccurrences([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [dateRange]); // eslint-disable-line react-hooks/exhaustive-deps

  return { 
    lineChartData, 
    pieChartData, 
    recentOccurrences, 
    loading, 
    error, 
    refetch: fetchChartData 
  };
}