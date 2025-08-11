# Prompt para Claude Code - Etapa 1

## 🎯 Objetivo da Etapa 1
Configurar a base do projeto com Supabase, Tailwind CSS, Shadcn/ui e criar a estrutura inicial do Dashboard e tela de Ocorrências.

## 📋 Tarefas desta Etapa

### 1. Setup Inicial
- Configurar Tailwind CSS no projeto Next.js
- Instalar e configurar Shadcn/ui (pelo menos: Button, Card, Table, Badge, Input, Select)
- Criar arquivo de configuração do Supabase
- Configurar variáveis de ambiente

### 2. Types e Database Schema
Criar types TypeScript baseadas no schema Supabase:
```typescript
// types/database.ts
export interface Company {
  id: number;
  created_at: string;
  nome: string;
  tipo: string;
  chat_id: string;
  empresa: number;
}

export interface Occurrence {
  id: number;
  created_at: string;
  justification: string;
  evidence: string;
  key_words: string;
  chat_type: string;
  chat_id: string;
  chat_name: string;
  channel: string;
  status: string;
  category: string;
}

export interface Message {
  id: number;
  created_at: string;
  sender: string;
  chat_id: string;
  content: string;
  push_name: string;
  chat_name: string;
  chat_event: string;
  chat_type: string;
  message_type: string;
}

export interface Group {
  id: number;
  created_at: string;
  subject: string;
  group_id: string;
  empresa: number;
  participants: any; // jsonb
}

export interface People {
  id: number;
  created_at: string;
  push_name: string;
  chat_id: string;
}
```

### 3. Layout Principal
Criar layout com:
- Sidebar com navegação (Dashboard, Chat, Ocorrências, Agente)
- Header simples
- Área de conteúdo principal
- Botão de refresh fixo no canto inferior direito

### 4. Configuração Supabase
- Arquivo lib/supabase.ts com client configurado
- Funções básicas para buscar dados das tabelas
- Hook personalizado para queries (useSupabaseQuery)

### 5. Páginas Base
- **Dashboard**: Estrutura com cards para métricas e área para gráficos (sem dados ainda)
- **Ocorrências**: Estrutura da tabela e filtros (sem dados ainda)

## 🛠️ Estrutura de Arquivos para Criar

```
src/
├── app/
│   ├── globals.css (configurar Tailwind)
│   ├── layout.tsx (layout raiz)
│   ├── page.tsx (Dashboard)
│   └── ocorrencias/
│       └── page.tsx
├── components/
│   ├── ui/ (componentes shadcn)
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── refresh-button.tsx
│   └── dashboard/
│       ├── metric-card.tsx
│       └── chart-placeholder.tsx
├── lib/
│   ├── supabase.ts
│   └── utils.ts
└── types/
    └── database.ts
```

## 🎨 Design Guidelines
- **Paleta minimalista**: Preto, branco e tons de cinza
- **Primary color**: #000000 (preto)
- **Background**: #ffffff (branco)
- **Muted backgrounds**: #f8f9fa (cinza muito claro)
- **Borders**: #e5e7eb (cinza claro)
- **Text secondary**: #6b7280 (cinza médio)
- Cards com bordas sutis em cinza claro
- Sidebar com fundo preto e texto branco
- Hover effects em cinza claro (#f3f4f6)
- Tipografia limpa e espaçamento consistente
- Responsive design (mobile-first)
- Visual clean e minimalista (estilo monochrome)

## 📦 Dependências Necessárias
```json
{
  "@supabase/supabase-js": "^2.x",
  "lucide-react": "^0.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x"
}
```

## ⚙️ Environment Variables (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎯 Resultado Esperado
Ao final desta etapa devemos ter:
- ✅ Projeto configurado com Tailwind e Shadcn/ui
- ✅ Layout base funcionando com navegação
- ✅ Integração Supabase configurada
- ✅ Types TypeScript definidos
- ✅ Estrutura do Dashboard (sem dados)
- ✅ Estrutura da tela de Ocorrências (sem dados)
- ✅ Botão de refresh funcional
