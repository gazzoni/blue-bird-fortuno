'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOccurrenceCharts } from '@/hooks/useOccurrenceCharts';

const COLORS = {
  'Pendente': '#6b7280',
  'Em Andamento': '#374151',
  'Concluído': '#111827',
  'Cancelado': '#9ca3af',
  'default': '#d1d5db'
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-black font-medium">{`${label}`}</p>
        <p className="text-gray-600">
          {`Total: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
}

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      status: string;
      total: number;
    };
  }>;
}

function PieTooltip({ active, payload }: PieTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-black font-medium">{data.status}</p>
        <p className="text-gray-600">
          {`Total: ${data.total}`}
        </p>
      </div>
    );
  }
  return null;
}

interface ChartsSectionProps {
  dateRange?: { from?: Date; to?: Date };
}

export function ChartsSection({ dateRange }: ChartsSectionProps) {
  const { lineChartData, pieChartData, loading, error } = useOccurrenceCharts(dateRange);

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              Erro ao carregar dados do gráfico
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              Erro ao carregar dados do gráfico
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Line Chart */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">
            Ocorrências por Período (7 dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Carregando gráfico...</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#000000" 
                    strokeWidth={2}
                    dot={{ fill: '#000000', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#000000', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">
            Status das Ocorrências
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Carregando gráfico...</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total"
                    label={(props: { status?: string; percent?: number }) => 
                      `${props.status || ''} ${props.percent ? (props.percent * 100).toFixed(0) : '0'}%`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.status as keyof typeof COLORS] || COLORS.default} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend 
                    wrapperStyle={{ 
                      paddingTop: '20px',
                      fontSize: '12px',
                      color: '#6b7280'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}