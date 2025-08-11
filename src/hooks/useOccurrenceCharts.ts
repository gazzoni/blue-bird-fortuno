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
        const fromDate = dateRange?.from?.toISOString() || '1900-01-01';
        const toDate = dateRange?.to?.toISOString() || '2100-01-01';

        // Fetch occurrences by day for line chart
        const { data: lineData, error: lineError } = await supabase
          .rpc('get_occurrences_by_day', { 
            start_date: fromDate, 
            end_date: toDate 
          })
          .order('date');

        // If RPC doesn't exist, try alternative approach
        let formattedLineData: ChartDataPoint[] = [];
        if (lineError) {
          console.warn('RPC get_occurrences_by_day not found, using alternative query');
          // Alternative: group by date using regular query
          const { data: rawData, error: altError } = await supabase
            .from('occurrences')
            .select('created_at')
            .gte('created_at', fromDate)
            .lte('created_at', toDate)
            .order('created_at');

          if (!altError && rawData) {
            // Group by date manually
            const dateGroups: { [key: string]: number } = {};
            rawData.forEach(item => {
              const date = new Date(item.created_at).toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit' 
              });
              dateGroups[date] = (dateGroups[date] || 0) + 1;
            });

            formattedLineData = Object.entries(dateGroups).map(([date, total]) => ({
              date,
              total
            }));
          }
        } else {
          formattedLineData = lineData?.map((item: { date: string; count: number }) => ({
            date: new Date(item.date).toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: '2-digit' 
            }),
            total: item.count
          })) || [];
        }

        // Fetch occurrences by status for pie chart
        const { data: pieData, error: pieError } = await supabase
          .from('occurrences')
          .select('status')
          .gte('created_at', fromDate)
          .lte('created_at', toDate);

        let formattedPieData: StatusDataPoint[] = [];
        if (!pieError && pieData) {
          const statusGroups: { [key: string]: number } = {};
          pieData.forEach(item => {
            const status = item.status || 'Sem Status';
            statusGroups[status] = (statusGroups[status] || 0) + 1;
          });

          formattedPieData = Object.entries(statusGroups).map(([status, total]) => ({
            status,
            total
          }));
        }

        // Fetch recent occurrences
        const { data: recentData } = await supabase
          .from('occurrences')
          .select('id, created_at, category, chat_name, status, chat_type')
          .gte('created_at', fromDate)
          .lte('created_at', toDate)
          .order('created_at', { ascending: false })
          .limit(5);

        const formattedRecentData = recentData?.map(item => ({
          id: item.id,
          created_at: item.created_at,
          category: item.category || 'Sem Categoria',
          chat_name: item.chat_name || 'Chat Desconhecido',
          status: item.status || 'Sem Status',
          chat_type: item.chat_type || 'Desconhecido'
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