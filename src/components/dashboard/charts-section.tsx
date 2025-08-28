'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, Tooltip, Legend, Dot } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ChartContainer, ChartConfig } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import { useOccurrenceCharts } from '@/hooks/useOccurrenceCharts';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const COLORS = {
  'Aberto': '#7dd3fc',      // sky-300 para aberto
  'Resolvido': '#bbf7d0',   // verde claro para resolvido  
  'default': '#6b7280'      // cinza para outros
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SQUAD_COLORS = {
  'Elite do Fluxo': '#0ea5e9',        // sky-500
  'Força Tática Financeira': '#0284c7' // sky-600
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BLUE_GRADIENT = ['#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e', '#164e63', '#155e75', '#0f172a'];

// Chart configs seguindo padrão shadcn/ui
const chartConfigBar = {
  total: {
    label: "Ocorrências",
    color: "#0ea5e9", // sky-500
  },
} satisfies ChartConfig;

const chartConfigLine = {
  total: {
    label: "Ocorrências",
    color: "#0ea5e9", // sky-500
  },
} satisfies ChartConfig;

const chartConfigSquad = {
  eliteDoFluxo: {
    label: "Elite do Fluxo",
    color: "#0ea5e9", // sky-500
  },
  forcaTaticaFinanceira: {
    label: "Força Tática Financeira", 
    color: "#0284c7", // sky-600
  },
} satisfies ChartConfig;

const chartConfigStatus = {
  aberto: {
    label: "Aberto",
    color: "#0ea5e9", // sky-500
  },
  resolvido: {
    label: "Resolvido", 
    color: "#0284c7", // sky-600
  },
} satisfies ChartConfig;

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  label?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
        <p className="text-popover-foreground font-medium">{`${label}`}</p>
        <p className="text-muted-foreground">
          {`Total: ${payload[0].value}`}
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
  const { lineChartData, statusByDayData, squadChartData, categoryChartData, clientChartData, loading, error } = useOccurrenceCharts(dateRange);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Erro ao carregar dados do gráfico
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Erro ao carregar dados do gráfico
              </div>
            </CardContent>
          </Card>
        </div>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* First Row: Total Chart - Full Width */}
      <Card className="min-h-[500px]">
        <CardHeader>
          <CardTitle>Total de Ocorrências</CardTitle>
          <CardDescription>Evolução diária das ocorrências</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Carregando gráfico...</div>
            </div>
          ) : (
            <ChartContainer config={chartConfigLine}>
              <LineChart
                accessibilityLayer
                data={lineChartData}
                margin={{
                  top: 24,
                  left: 24,
                  right: 24,
                }}
              >
                <CartesianGrid vertical={true} horizontal={true} strokeOpacity={0.2} />
                <YAxis 
                  domain={[-1, (dataMax: number) => dataMax + 1]}
                  tick={{ fontSize: 0 }}
                  axisLine={false}
                  tickCount={10}
                  width={0}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      // Pega a data do payload se o label não estiver correto
                      const date = payload[0]?.payload?.date || label;
                      return (
                        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
                          <p className="text-popover-foreground font-medium">{date}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-muted-foreground">
                              {`${entry.name}: ${entry.value}`}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  dataKey="total"
                  type="natural"
                  stroke="var(--color-total)"
                  strokeWidth={2}
                  dot={({ payload, ...props }) => {
                    return (
                      <Dot
                        key={payload.date}
                        r={5}
                        cx={props.cx}
                        cy={props.cy}
                        fill="var(--color-total)"
                        stroke="var(--color-total)"
                      />
                    )
                  }}
                />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Baseado no período selecionado <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Mostrando ocorrências dos últimos dias
          </div>
        </CardFooter>
      </Card>

      {/* Second Row: Status and Category Charts */}
      <div className="grid gap-4 md:grid-cols-2">

        {/* Status Stacked Bar Chart */}
        <Card className="min-h-[500px]">
        <CardHeader>
          <CardTitle>Ocorrências por Status</CardTitle>
          <CardDescription>Status das ocorrências por dia</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Carregando gráfico...</div>
            </div>
          ) : (
            <ChartContainer config={chartConfigStatus}>
              <BarChart accessibilityLayer data={statusByDayData}>
                <CartesianGrid vertical={true} horizontal={true} strokeOpacity={0.2} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value}
                />
                <YAxis 
                  domain={[0, (dataMax: number) => dataMax + 1]}
                  tick={{ fontSize: 0 }}
                  axisLine={false}
                  tickCount={10}
                  width={0}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
                          <p className="text-popover-foreground font-medium">{`${label}`}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-muted-foreground">
                              {`${entry.name}: ${entry.value}`}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{ fill: 'rgba(14, 165, 233, 0.05)' }}
                />
                <Legend 
                  verticalAlign="top"
                  height={36}
                  iconType="rect"
                  wrapperStyle={{ 
                    fontSize: '12px',
                    color: '#64748b'
                  }}
                />
                <Bar
                  dataKey="aberto"
                  stackId="a"
                  fill="var(--color-aberto)"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="resolvido"
                  stackId="a"
                  fill="var(--color-resolvido)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Acompanhe a evolução diária dos status <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Mostrando status aberto e resolvido por dia
          </div>
        </CardFooter>
        </Card>

        {/* Category Line Chart - Novo */}
        <Card className="min-h-[500px]">
          <CardHeader>
            <CardTitle>Ocorrências por Categoria</CardTitle>
            <CardDescription>Evolução das categorias por período</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">Carregando gráfico...</div>
              </div>
            ) : (
              <ChartContainer config={chartConfigLine}>
                <LineChart
                  accessibilityLayer
                  data={categoryChartData}
                  margin={{
                    top: 24,
                    left: 24,
                    right: 24,
                  }}
                >
                  <CartesianGrid vertical={true} horizontal={true} strokeOpacity={0.2} />
                  <YAxis 
                    domain={[-1, (dataMax: number) => dataMax + 1]}
                    tick={{ fontSize: 0 }}
                    axisLine={false}
                    tickCount={10}
                    width={0}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const date = payload[0]?.payload?.date || label;
                        return (
                          <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
                            <p className="text-popover-foreground font-medium">{date}</p>
                            {payload.map((entry, index) => (
                              <p key={index} className="text-muted-foreground">
                                {`${entry.name}: ${entry.value}`}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {categoryChartData.length > 0 && Object.keys(categoryChartData[0])
                    .filter(key => key !== 'date')
                    .map((category, index) => {
                      // Cores dinâmicas para diferentes categorias
                      const colors = ['#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e', '#164e63'];
                      const color = colors[index % colors.length];
                      
                      return (
                        <Line
                          key={category}
                          dataKey={category}
                          type="natural"
                          stroke={color}
                          strokeWidth={2}
                          dot={({ payload, ...props }) => {
                            return (
                              <Dot
                                key={`${payload.date}-${category}`}
                                r={4}
                                cx={props.cx}
                                cy={props.cy}
                                fill={color}
                                stroke={color}
                              />
                            )
                          }}
                        />
                      );
                    })
                  }
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              Evolução das categorias por período <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
              Mostrando todas as categorias de ocorrências
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Third Row: Squad and Client Charts */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Squad Line Chart - Padrão shadcn/ui */}
        <Card className="min-h-[500px]">
          <CardHeader>
            <CardTitle>Ocorrências por Squad</CardTitle>
            <CardDescription>Comparativo entre squads por período</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">Carregando gráfico...</div>
              </div>
            ) : (
              <ChartContainer config={chartConfigSquad}>
                <LineChart
                  accessibilityLayer
                  data={squadChartData}
                  margin={{
                    top: 24,
                    left: 24,
                    right: 24,
                  }}
                >
                  <CartesianGrid vertical={true} horizontal={true} strokeOpacity={0.2} />
                  <YAxis 
                    domain={[-1, (dataMax: number) => dataMax + 1]}
                    tick={{ fontSize: 0 }}
                    axisLine={false}
                    tickCount={10}
                    width={0}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        // Pega a data do payload se o label não estiver correto
                        const date = payload[0]?.payload?.date || label;
                        return (
                          <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
                            <p className="text-popover-foreground font-medium">{date}</p>
                            {payload.map((entry, index) => (
                              <p key={index} className="text-muted-foreground">
                                {`${entry.name}: ${entry.value}`}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    dataKey="Elite do Fluxo"
                    type="natural"
                    stroke="var(--color-eliteDoFluxo)"
                    strokeWidth={2}
                    dot={({ payload, ...props }) => {
                      return (
                        <Dot
                          key={payload.date}
                          r={5}
                          cx={props.cx}
                          cy={props.cy}
                          fill="var(--color-eliteDoFluxo)"
                          stroke="var(--color-eliteDoFluxo)"
                        />
                      )
                    }}
                  />
                  <Line 
                    dataKey="Força Tática Financeira"
                    type="natural" 
                    stroke="var(--color-forcaTaticaFinanceira)"
                    strokeWidth={2}
                    dot={({ payload, ...props }) => {
                      return (
                        <Dot
                          key={payload.date}
                          r={5}
                          cx={props.cx}
                          cy={props.cy}
                          fill="var(--color-forcaTaticaFinanceira)"
                          stroke="var(--color-forcaTaticaFinanceira)"
                        />
                      )
                    }}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              Performance comparativa dos squads <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
              Mostrando evolução de cada squad no período
          </div>
          </CardFooter>
      </Card>

        {/* Client Bar Chart - Padrão shadcn/ui */}
        <Card className="min-h-[500px]">
        <CardHeader>
            <CardTitle>Ocorrências por Cliente</CardTitle>
            <CardDescription>Top clientes com mais ocorrências</CardDescription>
        </CardHeader>
          <CardContent className="h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">Carregando gráfico...</div>
              </div>
            ) : (
              <ChartContainer config={chartConfigBar}>
                <BarChart accessibilityLayer data={clientChartData}>
                  <CartesianGrid vertical={true} horizontal={true} strokeOpacity={0.2} />
                  <XAxis
                    dataKey="client"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.length > 10 ? value.slice(0, 10) + '...' : value}
                  />
                  <YAxis 
                    domain={[0, (dataMax: number) => dataMax + 1]}
                    tick={{ fontSize: 0 }}
                    axisLine={false}
                    tickCount={10}
                    width={0}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
                            <p className="text-popover-foreground font-medium">{`${label}`}</p>
                            {payload.map((entry, index) => (
                              <p key={index} className="text-muted-foreground">
                                {`Ocorrências: ${entry.value}`}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                    cursor={{ fill: 'rgba(14, 165, 233, 0.05)' }}
                  />
                  <Bar dataKey="total" fill="var(--color-total)" radius={8} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              Baseado nos dados do período selecionado <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
              Mostrando os principais clientes com ocorrências
          </div>
          </CardFooter>
      </Card>
      </div>
    </div>
  );
}