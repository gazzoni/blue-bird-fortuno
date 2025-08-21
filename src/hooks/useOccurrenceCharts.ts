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

export interface StatusByDayDataPoint {
  date: string;
  aberto: number;
  resolvido: number;
}

export interface SquadDataPoint {
  date: string;
  'Elite do Fluxo': number;
  'Força Tática Financeira': number;
}

export interface ClientDataPoint {
  client: string;
  total: number;
}

export interface RecentOccurrence {
  id: number;
  created_at: string;
  category: string;
  chat_name: string;
  status: string;
  squad: string;
}

export function useOccurrenceCharts(dateRange?: { from?: Date; to?: Date }) {
  const [lineChartData, setLineChartData] = useState<ChartDataPoint[]>([]);
  const [statusByDayData, setStatusByDayData] = useState<StatusByDayDataPoint[]>([]);
  const [squadChartData, setSquadChartData] = useState<SquadDataPoint[]>([]);
  const [clientChartData, setClientChartData] = useState<ClientDataPoint[]>([]);
  const [recentOccurrences, setRecentOccurrences] = useState<RecentOccurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const fromDate = dateRange?.from?.toISOString() || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const toDate = dateRange?.to?.toISOString() || new Date().toISOString();

      // Fetch occurrences by day for line chart using regular query
      const { data: rawData, error: rawError } = await supabase
        .from('new-occurrences')
        .select('created_at, squad, client_name, status')
        .gte('created_at', fromDate)
        .lte('created_at', toDate)
        .order('created_at');



      let formattedLineData: ChartDataPoint[] = [];
      let formattedStatusByDayData: StatusByDayDataPoint[] = [];
      let formattedSquadData: SquadDataPoint[] = [];
      let formattedClientData: ClientDataPoint[] = [];
      
      if (!rawError && rawData) {
        // Group by date manually
        const dateGroups: { [key: string]: number } = {};
        const statusDateGroups: { [key: string]: { [status: string]: number } } = {};
        const squadDateGroups: { [key: string]: { [squad: string]: number } } = {};
        const clientGroups: { [key: string]: number } = {};
        
        rawData.forEach(item => {
          const date = new Date(item.created_at).toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit' 
          });
          
          // Total por data
          dateGroups[date] = (dateGroups[date] || 0) + 1;
          
          // Por status e data
          if (!statusDateGroups[date]) {
            statusDateGroups[date] = {};
          }
          const status = item.status || 'sem_status';
          statusDateGroups[date][status] = (statusDateGroups[date][status] || 0) + 1;
          
          // Por squad e data
          if (!squadDateGroups[date]) {
            squadDateGroups[date] = {};
          }
          const squad = item.squad || 'Sem Squad';
          squadDateGroups[date][squad] = (squadDateGroups[date][squad] || 0) + 1;
          
          // Por cliente
          const client = item.client_name || 'Cliente não identificado';
          // Limpar o nome do cliente (remover caracteres especiais se necessário)
          const cleanClient = client.trim();
          clientGroups[cleanClient] = (clientGroups[cleanClient] || 0) + 1;
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

        // Status by day data
        formattedStatusByDayData = Object.entries(statusDateGroups)
          .map(([date, statuses]) => ({
            date,
            aberto: statuses['aberto'] || 0,
            resolvido: statuses['resolvido'] || 0,
          }))
          .sort((a, b) => {
            const [dayA, monthA] = a.date.split('/');
            const [dayB, monthB] = b.date.split('/');
            const dateA = new Date(2024, parseInt(monthA) - 1, parseInt(dayA));
            const dateB = new Date(2024, parseInt(monthB) - 1, parseInt(dayB));
            return dateA.getTime() - dateB.getTime();
          });

        // Squad data
        formattedSquadData = Object.entries(squadDateGroups)
          .map(([date, squads]) => ({
            date,
            'Elite do Fluxo': squads['Elite do Fluxo'] || 0,
            'Força Tática Financeira': squads['Força Tática Financeira'] || 0,
          }))
          .sort((a, b) => {
            const [dayA, monthA] = a.date.split('/');
            const [dayB, monthB] = b.date.split('/');
            const dateA = new Date(2024, parseInt(monthA) - 1, parseInt(dayA));
            const dateB = new Date(2024, parseInt(monthB) - 1, parseInt(dayB));
            return dateA.getTime() - dateB.getTime();
          });

        // Client data (top 10)
        formattedClientData = Object.entries(clientGroups)
          .map(([client, total]) => ({ client, total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 10);
      } else {
        console.error('Erro ao buscar dados para gráfico de linha:', rawError);
      }

      // Fetch recent occurrences usando campos reais
      const { data: recentData } = await supabase
        .from('new-occurrences')
        .select('id, created_at, chat_name, status, category, squad')
        .gte('created_at', fromDate)
        .lte('created_at', toDate)
        .order('created_at', { ascending: false })
        .limit(5);

      const statusLabelRecent: Record<string, string> = {
        aberto: 'Aberto',
        resolvido: 'Resolvido',
      };
      const formattedRecentData = recentData?.map(item => ({
        id: item.id,
        created_at: item.created_at,
        category: item.category || 'Sem Categoria',
        chat_name: item.chat_name || '—',
        status: statusLabelRecent[item.status as keyof typeof statusLabelRecent] ?? (item.status || 'Sem Status'),
        squad: item.squad || '—',
      })) || [];


      setLineChartData(formattedLineData);
      setStatusByDayData(formattedStatusByDayData);
      setSquadChartData(formattedSquadData);
      setClientChartData(formattedClientData);
      setRecentOccurrences(formattedRecentData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Fallback to empty data
      setLineChartData([]);
      setStatusByDayData([]);
      setSquadChartData([]);
      setClientChartData([]);
      setRecentOccurrences([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [dateRange]); // eslint-disable-line react-hooks/exhaustive-deps

  return { 
    lineChartData, 
    statusByDayData, 
    squadChartData,
    clientChartData,
    recentOccurrences, 
    loading, 
    error, 
    refetch: fetchChartData 
  };
}