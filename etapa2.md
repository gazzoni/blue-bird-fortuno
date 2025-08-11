# Prompt para Claude Code - Etapa 2

## 🎯 Objetivo da Etapa 2
Implementar o Dashboard funcional com dados reais do Supabase, incluindo métricas, gráficos e integração completa com o banco de dados.

## 📋 Tarefas desta Etapa

### 1. Implementar Métricas do Dashboard
Criar 4 cards de métricas principais que busquem dados reais do Supabase:

**Card 1: Ocorrências WhatsApp**
- Contar ocorrências where chat_type = 'Grupo' OR chat_type = 'Privado'
- Mostrar número total + variação últimas 24h
- Ícone: MessageSquare

**Card 2: Ocorrências Email** 
- Contar ocorrências where channel = 'email'
- Mostrar número total + variação últimas 24h  
- Ícone: Mail

**Card 3: Sentimento Médio**
- Calcular média do campo sentimento das mensagens (se existir) ou placeholder "85%"
- Mostrar como porcentagem + indicador visual (cor verde/amarelo/vermelho)
- Ícone: Heart

**Card 4: Status Pendentes**
- Contar ocorrências where status = 'Pendente' 
- Mostrar número + cor de alerta
- Ícone: AlertTriangle

### 2. Implementar Gráficos com Recharts
Instalar Recharts e criar:

**Gráfico 1: Linha - Ocorrências por Período (últimos 7 dias)**
```sql
-- Query para agrupar ocorrências por dia
SELECT 
  DATE(created_at) as data,
  COUNT(*) as total
FROM occurrences 
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY data
```

**Gráfico 2: Pizza - Status das Ocorrências**
```sql
-- Query para agrupar por status
SELECT 
  status,
  COUNT(*) as total
FROM occurrences 
GROUP BY status
```

### 3. Criar Hooks Personalizados
Implementar hooks para buscar dados:

```typescript
// hooks/useDashboardMetrics.ts
export function useDashboardMetrics() {
  // Hook para buscar métricas dos cards
}

// hooks/useOccurrenceCharts.ts  
export function useOccurrenceCharts() {
  // Hook para buscar dados dos gráficos
}
```

### 4. Implementar Botão de Refresh
- Botão fixo no canto inferior direito
- Ícone de refresh que gira durante loading
- Trigger manual para recarregar todos os dados
- Loading state visual

### 5. Tabela de Últimas Ocorrências
Criar componente que mostra as 5 ocorrências mais recentes:
- Colunas: Data, Tipo, Cliente/Chat, Status, Ação
- Link para ver detalhes
- Status com badges coloridos

## 🛠️ Estrutura de Arquivos para Criar/Atualizar

```
src/
├── app/
│   └── page.tsx (Dashboard - implementar dados)
├── components/
│   ├── dashboard/
│   │   ├── metric-cards.tsx
│   │   ├── charts-section.tsx
│   │   ├── recent-occurrences.tsx
│   │   └── refresh-button.tsx
│   └── ui/
│       └── loading-spinner.tsx
├── hooks/
│   ├── useDashboardMetrics.ts
│   ├── useOccurrenceCharts.ts
│   └── useRefreshData.ts
└── lib/
    └── queries.ts (queries SQL organizadas)
```

## 📊 Queries SQL Necessárias

```typescript
// lib/queries.ts
export const dashboardQueries = {
  whatsappOccurrences: `
    SELECT COUNT(*) as total 
    FROM occurrences 
    WHERE chat_type IN ('Grupo', 'Privado')
  `,
  
  emailOccurrences: `
    SELECT COUNT(*) as total 
    FROM occurrences 
    WHERE channel = 'email'
  `,
  
  pendingOccurrences: `
    SELECT COUNT(*) as total 
    FROM occurrences 
    WHERE status = 'Pendente'
  `,
  
  occurrencesByDay: `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as total
    FROM occurrences 
    WHERE created_at >= NOW() - INTERVAL '7 days'
    GROUP BY DATE(created_at)
    ORDER BY date
  `,
  
  occurrencesByStatus: `
    SELECT 
      status,
      COUNT(*) as total
    FROM occurrences 
    GROUP BY status
  `,
  
  recentOccurrences: `
    SELECT 
      id,
      created_at,
      category,
      chat_name,
      status,
      chat_type
    FROM occurrences 
    ORDER BY created_at DESC 
    LIMIT 5
  `
};
```

## 🎨 Design Guidelines (Mantém da Etapa 1)
- Paleta minimalista: Preto, branco e tons de cinza
- Cards com bordas sutis em cinza claro  
- Gráficos com cores em escala de cinza
- Loading states minimalistas
- Hover effects sutis

## 📦 Nova Dependência
```json
{
  "recharts": "^2.x"
}
```

## 🎯 Resultado Esperado
Ao final desta etapa devemos ter:
- ✅ Dashboard totalmente funcional com dados reais
- ✅ 4 cards de métricas atualizando do Supabase
- ✅ 2 gráficos funcionais (linha e pizza)
- ✅ Tabela de últimas ocorrências
- ✅ Botão de refresh funcional
- ✅ Loading states em todos os componentes
- ✅ Hooks organizados para reuso

## 🔄 Comando para Claude Code
```bash
claude dev
```

**Prompt para colar no Claude Code:**
"Implemente a Etapa 2 do projeto Copiloto de Supervisão WhatsApp conforme especificado acima. Foque em criar um Dashboard totalmente funcional com dados reais do Supabase, implementando as métricas, gráficos com Recharts e sistema de refresh. Mantenha o design minimalista em preto e branco."