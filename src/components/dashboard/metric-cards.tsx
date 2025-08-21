'use client';

import { BarChart3, Calendar, Heart, TrendingUp as TrendingUpIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';

interface MetricCardProps {
  title: string;
  value: number | string;
  variation?: number;
  icon: React.ReactNode;
  type?: 'default' | 'percentage' | 'alert';
}

function MetricCard({ title, value, variation, icon, type = 'default' }: MetricCardProps) {
  const getVariationColor = (variation: number) => {
    if (variation > 0) return 'text-green-600';
    if (variation < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const getVariationIcon = (variation: number) => {
    if (variation > 0) return <TrendingUp className="h-3 w-3" />;
    if (variation < 0) return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  return (
    <Card className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {type === 'percentage' ? `${value}%` : value}
        </div>
        {variation !== undefined && (
          <div className={`flex items-center text-xs ${getVariationColor(variation)} mt-1`}>
            {getVariationIcon(variation)}
            <span className="ml-1">
              {variation > 0 ? '+' : ''}{variation}% nas últimas 24h
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricCardsProps {
  dateRange?: { from?: Date; to?: Date };
}

export function MetricCards({ dateRange }: MetricCardsProps) {
  const { metrics, loading, error } = useDashboardMetrics(dateRange);

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                Erro ao carregar dados
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Ocorrências Totais",
      value: loading ? "..." : metrics.totalOccurrences,
      variation: loading ? undefined : metrics.totalVariation,
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      title: "Média de Ocorrências Diárias",
      value: loading ? "..." : metrics.dailyAverage,
      variation: loading ? undefined : metrics.averageVariation,
      icon: <Calendar className="h-4 w-4" />,
      type: 'default' as const,
    },
    {
      title: "Sentimento Médio",
      value: loading ? "..." : metrics.sentimentAvg,
      icon: <Heart className="h-4 w-4" />,
      type: 'percentage' as const,
    },
    {
      title: "Risco de Churn",
      value: loading ? "..." : metrics.churnRisk,
      icon: <TrendingUpIcon className="h-4 w-4" />,
      type: 'percentage' as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <MetricCard
          key={index}
          title={card.title}
          value={card.value}
          variation={card.variation}
          icon={card.icon}
          type={card.type}
        />
      ))}
    </div>
  );
}