'use client';

import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
// import { dashboardQueries } from '@/lib/queries';

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

export function useOccurrenceCharts() {
  const [lineChartData, setLineChartData] = useState<ChartDataPoint[]>([]);
  const [pieChartData, setPieChartData] = useState<StatusDataPoint[]>([]);
  const [recentOccurrences, setRecentOccurrences] = useState<RecentOccurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, use mock data since we don't have the actual database
      // In a real implementation, these would be actual Supabase queries
      
      // Mock line chart data (last 7 days)
      const mockLineData = [
        { date: '05/08', total: 12 },
        { date: '06/08', total: 19 },
        { date: '07/08', total: 8 },
        { date: '08/08', total: 23 },
        { date: '09/08', total: 15 },
        { date: '10/08', total: 31 },
        { date: '11/08', total: 18 }
      ];

      // Mock pie chart data
      const mockPieData = [
        { status: 'Pendente', total: 7 },
        { status: 'Em Andamento', total: 12 },
        { status: 'Concluído', total: 23 },
        { status: 'Cancelado', total: 3 }
      ];

      // Mock recent occurrences
      const mockRecentData = [
        {
          id: 1,
          created_at: new Date().toISOString(),
          category: 'Spam',
          chat_name: 'Grupo Marketing',
          status: 'Pendente',
          chat_type: 'Grupo'
        },
        {
          id: 2,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          category: 'Linguagem Inadequada',
          chat_name: 'Chat Vendas',
          status: 'Em Andamento',
          chat_type: 'Privado'
        },
        {
          id: 3,
          created_at: new Date(Date.now() - 7200000).toISOString(),
          category: 'Conteúdo Suspeito',
          chat_name: 'Grupo RH',
          status: 'Concluído',
          chat_type: 'Grupo'
        },
        {
          id: 4,
          created_at: new Date(Date.now() - 10800000).toISOString(),
          category: 'Assédio',
          chat_name: 'Chat Atendimento',
          status: 'Pendente',
          chat_type: 'Privado'
        },
        {
          id: 5,
          created_at: new Date(Date.now() - 14400000).toISOString(),
          category: 'Vazamento de Dados',
          chat_name: 'Grupo Desenvolvedores',
          status: 'Em Andamento',
          chat_type: 'Grupo'
        }
      ];

      setLineChartData(mockLineData);
      setPieChartData(mockPieData);
      setRecentOccurrences(mockRecentData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return { 
    lineChartData, 
    pieChartData, 
    recentOccurrences, 
    loading, 
    error, 
    refetch: fetchChartData 
  };
}