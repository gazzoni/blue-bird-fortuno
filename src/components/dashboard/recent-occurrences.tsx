'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import { useOccurrenceCharts } from '@/hooks/useOccurrenceCharts';
import { OccurrenceDetails } from '@/components/occurrences/occurrence-details';
import { updateOccurrenceStatus, updateOccurrenceDescription, updateOccurrenceResolution, supabase } from '@/lib/supabase';
import type { Occurrence } from '@/hooks/useOccurrenceFilters';

const statusColors = {
  'aberto': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'resolvido': 'bg-green-100 text-green-800 border-green-200', 
  'default': 'bg-gray-100 text-gray-800 border-gray-200'
};

const squadColors = {
  'Elite do Fluxo': 'bg-sky-100 text-sky-800 border-sky-200',
  'Força Tática Financeira': 'bg-sky-200 text-sky-900 border-sky-300',
  'default': 'bg-gray-100 text-gray-800 border-gray-200'
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

interface RecentOccurrencesProps {
  dateRange?: { from?: Date; to?: Date };
}

export function RecentOccurrences({ dateRange }: RecentOccurrencesProps) {
  const { recentOccurrences, loading, error } = useOccurrenceCharts(dateRange);
  const [selectedOccurrence, setSelectedOccurrence] = useState<Occurrence | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const router = useRouter();

  const handleOpenDetails = async (occurrenceData: any) => {
    setLoadingDetails(true);
    setIsDetailsModalOpen(true);
    
    try {
      // Buscar dados completos da ocorrência
      const { data: fullData, error } = await supabase
        .from('new-occurrences')
        .select('*')
        .eq('id', occurrenceData.id)
        .single();

      if (error) throw error;

      if (fullData) {
        const fullOccurrence: Occurrence = {
          id: fullData.id,
          createdAt: fullData.created_at,
          chatId: fullData.chat_id || '',
          chatName: fullData.chat_name || occurrenceData.chat_name,
          clientName: fullData.client_name || '',
          occurrenceName: fullData.occurrence_name || '',
          status: fullData.status || 'aberto',
          description: fullData.description || '',
          occurrenceResolution: fullData.occurrence_resolution || '',
          keyWords: fullData.key_words || '',
          messages: fullData.messages || {},
          channel: fullData.channel || '',
          gateKeeper: fullData.gate_kepper || false,
          squad: fullData.squad || occurrenceData.squad,
          category: fullData.category || occurrenceData.category,
        };
        
        setSelectedOccurrence(fullOccurrence);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da ocorrência:', error);
      // Fallback para dados básicos se houver erro
      const basicOccurrence: Occurrence = {
        id: occurrenceData.id,
        createdAt: occurrenceData.created_at,
        chatId: '',
        chatName: occurrenceData.chat_name,
        clientName: '',
        occurrenceName: '',
        status: occurrenceData.status.toLowerCase(),
        description: '',
        occurrenceResolution: '',
        keyWords: '',
        messages: {},
        channel: '',
        gateKeeper: false,
        squad: occurrenceData.squad,
        category: occurrenceData.category,
      };
      setSelectedOccurrence(basicOccurrence);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleStatusUpdate = async (occurrenceId: number, newStatus: string) => {
    try {
      await updateOccurrenceStatus(occurrenceId, newStatus);
      // Recarregar dados seria ideal aqui, mas por simplicidade vamos atualizar localmente
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleDescriptionUpdate = async (occurrenceId: number, newDescription: string) => {
    try {
      await updateOccurrenceDescription(occurrenceId, newDescription);
    } catch (error) {
      console.error('Erro ao atualizar descrição:', error);
    }
  };

  const handleResolutionUpdate = async (occurrenceId: number, newResolution: string) => {
    try {
      await updateOccurrenceResolution(occurrenceId, newResolution);
    } catch (error) {
      console.error('Erro ao atualizar resolução:', error);
    }
  };

  const handleViewAllOccurrences = () => {
    router.push('/ocorrencias');
  };

  if (error) {
    return (
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">
            Últimas Ocorrências
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            Erro ao carregar ocorrências
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Últimas Ocorrências
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-muted rounded w-16"></div>
                    <div className="h-6 bg-muted rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recentOccurrences.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Nenhuma ocorrência encontrada
          </div>
        ) : (
          <div className="space-y-3">
            {recentOccurrences.map((occurrence) => (
              <div
                key={occurrence.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="text-sm font-medium text-card-foreground truncate">
                      {occurrence.chat_name}
                    </div>
                    <Badge 
                      variant="outline"
                      className={squadColors[occurrence.squad as keyof typeof squadColors] || squadColors.default}
                    >
                      {occurrence.squad}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{formatDate(occurrence.created_at)}</span>
                    <span>•</span>
                    <span>{occurrence.category}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant="outline"
                    className={statusColors[occurrence.status as keyof typeof statusColors] || statusColors.default}
                  >
                    {occurrence.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-black"
                    onClick={() => handleOpenDetails(occurrence)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && recentOccurrences.length > 0 && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              className="text-black border-gray-300 hover:bg-gray-50"
              onClick={handleViewAllOccurrences}
            >
              Ver todas as ocorrências
            </Button>
          </div>
        )}
      </CardContent>

      {/* Modal de Detalhes */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          {loadingDetails ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Carregando detalhes...</div>
            </div>
          ) : selectedOccurrence ? (
            <OccurrenceDetails
              occurrence={selectedOccurrence}
              onStatusUpdate={handleStatusUpdate}
              onDescriptionUpdate={handleDescriptionUpdate}
              onResolutionUpdate={handleResolutionUpdate}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </Card>
  );
}