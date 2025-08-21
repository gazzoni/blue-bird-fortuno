# 🐦 Blue Bird - Sistema de Monitoramento Inteligente

> Plataforma avançada de análise e monitoramento de comunicações empresariais com IA integrada

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)](https://supabase.com/)

## ✨ Principais Funcionalidades

### 📊 **Dashboard Inteligente**
- **Métricas em tempo real** com cards informativos
- **Charts interativos** usando Recharts + Shadcn/ui
- **Análise por período** com filtros de data
- **Visualizações por squad, cliente e status**

### 🔍 **Sistema de Ocorrências**
- **Filtros avançados** por texto, status, categoria e squad
- **Ordenação dinâmica** por data, cliente, status e categoria
- **Modal de detalhes** com visualização completa
- **Chat WhatsApp integrado** para mensagens JSONB

### 📝 **Análise de Reuniões com IA**
- **Upload de arquivos** de áudio/vídeo
- **Inserção manual** de transcrições
- **Geração automática** de documentos markdown
- **Histórico de análises** com preview e download

### 🎨 **Interface Moderna**
- **Dark/Light Mode** com alternância suave
- **Design responsivo** para todos os dispositivos
- **Componentes Shadcn/ui** para consistência visual
- **Logo Blue Bird** com adaptação automática ao tema

### 🔗 **Integração Completa**
- **Supabase** para banco de dados PostgreSQL
- **Row Level Security (RLS)** para segurança
- **Queries SQL otimizadas** para performance
- **TypeScript** para type safety

## 🚀 Tecnologias Utilizadas

### **Frontend**
- [Next.js 15.4.6](https://nextjs.org/) - Framework React para produção
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- [Shadcn/ui](https://ui.shadcn.com/) - Componentes UI modernos

### **Visualização de Dados**
- [Recharts](https://recharts.org/) - Library de charts para React
- [Lucide React](https://lucide.dev/) - Ícones SVG
- [React Markdown](https://github.com/remarkjs/react-markdown) - Renderização markdown

### **Backend & Database**
- [Supabase](https://supabase.com/) - Backend-as-a-Service
- PostgreSQL - Banco de dados relacional
- Row Level Security - Controle de acesso

### **Build & Deploy**
- [Vercel](https://vercel.com/) - Plataforma de deploy
- ESLint - Linting de código
- Prettier - Formatação de código

## 📦 Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn
- Conta no Supabase

### **1. Clone o repositório**
```bash
git clone https://github.com/gazzoni/blue-bird-fortuno.git
cd blue-bird-fortuno
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### **4. Configure o banco de dados**
Execute os scripts SQL no Supabase para criar as tabelas:

```sql
-- Tabela principal de ocorrências
CREATE TABLE "new-occurrences" (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  chat_id text,
  chat_name text,
  client_name text,
  status text CHECK (status IN ('aberto', 'resolvido')),
  description text,
  key_words text,
  messages jsonb,
  channel text CHECK (channel IN ('Whatsapp', 'Email')),
  gate_kepper boolean DEFAULT false,
  squad text CHECK (squad IN ('Elite do Fluxo', 'Força Tática Financeira')),
  category text CHECK (category IN ('contas a pagar', 'contas a receber', 'conciliação bancária'))
);

-- Habilitar RLS
ALTER TABLE "new-occurrences" ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública (ajuste conforme necessário)
CREATE POLICY "Enable read access for all users" ON "new-occurrences"
  FOR SELECT USING (true);
```

### **5. Execute o projeto**
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start
```

## 🏗️ Estrutura do Projeto

```
blue-bird-fortuno/
├── public/
│   ├── bluebird_logo.svg      # Logo principal
│   └── favicon.svg            # Favicon
├── src/
│   ├── app/                   # Pages (App Router)
│   │   ├── analise/          # Página de análise de reuniões
│   │   ├── ocorrencias/      # Página de ocorrências
│   │   └── layout.tsx        # Layout raiz
│   ├── components/           # Componentes reutilizáveis
│   │   ├── dashboard/        # Componentes do dashboard
│   │   ├── feedback/         # Sistema de feedback
│   │   ├── layout/           # Componentes de layout
│   │   ├── occurrences/      # Componentes de ocorrências
│   │   └── ui/               # Componentes UI base
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilities e configurações
│   └── types/                # Definições TypeScript
└── tailwind.config.js        # Configuração Tailwind
```

## 🎯 Funcionalidades Detalhadas

### **Dashboard**
- 📈 **Métricas**: Total de ocorrências e média diária
- 📊 **Gráfico de linha**: Evolução temporal das ocorrências
- 👥 **Gráfico por squad**: Performance por equipe
- 🏢 **Gráfico por cliente**: Distribuição por cliente
- 📋 **Gráfico de status**: Aberto vs Resolvido por dia
- 📝 **Tabela recente**: 5 ocorrências mais recentes

### **Ocorrências**
- 🔍 **Busca textual**: Por descrição, cliente, chat, palavras-chave
- 🏷️ **Filtros**: Status, categoria, squad
- 📊 **Ordenação**: Data, status, cliente, squad, categoria
- 👁️ **Modal de detalhes**: Visualização completa com chat WhatsApp
- 👍 **Sistema de feedback**: Like/dislike com comentários

### **Análise de Reuniões**
- 📁 **Upload de arquivos**: Drag & drop para áudio/vídeo
- 📝 **Inserção manual**: Cole transcrições diretamente
- ⚡ **Processamento IA**: Geração automática via n8n
- 📄 **Preview markdown**: Visualização formatada
- 📥 **Download**: Exportação dos documentos

### **Temas**
- 🌙 **Dark mode**: Interface escura para uso noturno
- ☀️ **Light mode**: Interface clara padrão
- 🔄 **Alternância**: Switch no canto inferior da sidebar
- 🎨 **Consistência**: Todos os componentes adaptáveis

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build e Deploy
npm run build        # Build otimizado para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa ESLint
npm run lint:fix     # Corrige erros de linting automaticamente

# Utilitários
npm run type-check   # Verifica tipos TypeScript
```

## 🌐 Deploy na Vercel

### **Deploy Automático**
1. Conecte o repositório à sua conta Vercel
2. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy automático a cada push na branch `main`

### **Deploy Manual**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🔐 Segurança

- ✅ **Row Level Security** habilitado no Supabase
- ✅ **Variáveis de ambiente** para credenciais
- ✅ **TypeScript** para type safety
- ✅ **ESLint** para qualidade de código
- ✅ **Build otimizado** sem exposição de secrets

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🐦 Sobre o Blue Bird

O Blue Bird é uma plataforma moderna de monitoramento e análise de comunicações empresariais, desenvolvida com as mais recentes tecnologias web para oferecer uma experiência de usuário excepcional e insights valiosos para tomada de decisões.

---

**Desenvolvido com ❤️ pela equipe Blue Bird**