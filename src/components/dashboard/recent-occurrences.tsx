'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useOccurrenceCharts } from '@/hooks/useOccurrenceCharts';

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
                    onClick={() => {
                      // TODO: Implementar navegação para detalhes
                      console.log('Ver detalhes da ocorrência:', occurrence.id);
                    }}
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
              onClick={() => {
                // TODO: Implementar navegação para página de ocorrências
                console.log('Ver todas as ocorrências');
              }}
            >
              Ver todas as ocorrências
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}