# Sistema de Autenticação - Plano de Implementação

## 📋 Visão Geral

Implementar um sistema simples de autenticação usando **Supabase Auth** para controlar o acesso à plataforma. Todos os usuários autenticados terão o mesmo nível de acesso - o objetivo é apenas evitar uso não autorizado.

## 🎯 Objetivos

- ✅ Bloquear acesso de usuários não autenticados
- ✅ Sistema simples de login/logout
- ✅ Alteração de senha para usuários existentes
- ✅ Todos os usuários têm permissões iguais
- ✅ Interface de login integrada ao design atual
- ✅ Persistência de sessão
- ❌ **Não haverá registro** - usuários criados apenas pelo admin

## 🛠️ Tecnologias

- **Supabase Auth**: Sistema de autenticação
- **Next.js 14**: App Router com middleware
- **TypeScript**: Tipagem forte
- **Tailwind CSS**: Estilização consistente

---

## 📝 Tarefas de Implementação

### 1. **Configuração do Supabase Auth**
- [ ] Configurar políticas de autenticação no painel Supabase
- [ ] Definir provider de login (apenas email/senha)
- [ ] **Desabilitar registro público** no painel Supabase
- [ ] Configurar redirects e URLs permitidas
- [ ] Criar usuários iniciais via painel admin
- [ ] Testar configuração básica

### 2. **Configuração do Cliente Supabase**
- [ ] Atualizar arquivo `lib/supabase.ts` com configurações de auth
- [ ] Configurar cliente para funcionar no servidor e cliente
- [ ] Adicionar variáveis de ambiente necessárias
- [ ] Criar tipos TypeScript para usuário

### 3. **Middleware de Autenticação**
- [ ] Criar `middleware.ts` na raiz do projeto
- [ ] Implementar verificação de sessão
- [ ] Definir rotas protegidas e públicas
- [ ] Configurar redirects automáticos

### 4. **Páginas de Autenticação**
- [ ] Criar página de login (`/login`)
- [ ] Criar página de alteração de senha (`/change-password`)
- [ ] Implementar formulários com validação
- [ ] Adicionar feedback visual de loading/erro
- [ ] Integrar com design system existente
- [ ] Link para alteração de senha no perfil/header

### 5. **Context/Provider de Autenticação**
- [ ] Criar AuthContext para gerenciar estado do usuário
- [ ] Implementar AuthProvider no layout principal
- [ ] Criar hooks customizados (`useAuth`, `useUser`)
- [ ] Gerenciar loading states e sessão

### 6. **Componentes de Interface**
- [ ] Componente de avatar/perfil no header
- [ ] Botão de logout
- [ ] Link/botão para alteração de senha
- [ ] Estados de loading durante autenticação
- [ ] Tratamento de erros de autenticação

### 7. **Proteção de Rotas**
- [ ] Proteger todas as páginas principais (`/`, `/analise`, `/ocorrencias`, `/agente`)
- [ ] Implementar redirecionamento para login
- [ ] Manter estado de redirecionamento pós-login
- [ ] Testar navegação em diferentes cenários

### 8. **Integração com Banco de Dados**
- [ ] Revisar políticas RLS (Row Level Security) nas tabelas
- [ ] Configurar políticas para usuários autenticados
- [ ] Testar acesso aos dados com usuário logado
- [ ] Validar segurança das operações

### 9. **Experiência do Usuário**
- [ ] Implementar "Lembrar-me" 
- [ ] Timeout de sessão apropriado
- [ ] Mensagens de feedback claras
- [ ] Transições suaves entre estados
- [ ] Fluxo de alteração de senha intuitivo
- [ ] Confirmação de alteração de senha bem-sucedida

### 10. **Testes e Validação**
- [ ] Testar fluxo completo de login/logout
- [ ] Testar alteração de senha
- [ ] Validar proteção de rotas
- [ ] Testar persistência de sessão
- [ ] Verificar que registro público está desabilitado
- [ ] Verificar comportamento em diferentes navegadores

---

## 📁 Estrutura de Arquivos Necessária

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx              # Página de login
│   ├── change-password/
│   │   └── page.tsx              # Página de alteração de senha
│   └── layout.tsx                # Atualizar com AuthProvider
├── components/
│   ├── auth/
│   │   ├── login-form.tsx        # Formulário de login
│   │   ├── change-password-form.tsx # Formulário alteração senha
│   │   ├── auth-button.tsx       # Botão login/logout
│   │   └── protected-route.tsx   # Componente de proteção
│   └── layout/
│       └── header.tsx            # Atualizar com auth + link senha
├── contexts/
│   └── auth-context.tsx          # Context de autenticação
├── hooks/
│   ├── useAuth.ts               # Hook de autenticação
│   └── useUser.ts               # Hook do usuário
├── lib/
│   ├── supabase.ts              # Atualizar configuração
│   └── auth.ts                  # Utilitários de auth
└── middleware.ts                # Middleware de proteção
```

---

## 🔧 Configurações Necessárias

### Variáveis de Ambiente
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Auth Settings
- **Site URL**: `http://localhost:3000` (dev) / `https://yourdomain.com` (prod)
- **Redirect URLs**: 
  - `http://localhost:3000/auth/callback`
  - `https://yourdomain.com/auth/callback`
- **Disable public registration**: ✅ Habilitado
- **Email confirmations**: Configurar conforme necessário
- **Password reset**: Habilitado para alteração de senha

---

## 🚀 Fluxo de Implementação Sugerido

### **Fase 1: Base** (Essencial)
1. Configuração Supabase Auth (com registro desabilitado)
2. Criação de usuários iniciais via admin
3. Middleware de autenticação  
4. Página de login básica
5. Context de autenticação

### **Fase 2: Interface** (UX)
6. Componentes de auth
7. Integração no header com logout
8. Página de alteração de senha
9. Proteção de rotas
10. Feedback visual

### **Fase 3: Refinamento** (Qualidade)
11. Testes completos (login/logout/senha)
12. Otimizações de UX
13. Tratamento de edge cases
14. Validação de segurança

---

## 🎨 Considerações de Design

- **Página de Login**: Manter consistência visual com o resto da aplicação
- **Página de Alteração de Senha**: Formulário simples e intuitivo
- **Loading States**: Usar os mesmos componentes (Loader2, etc.)
- **Cores**: Seguir paleta existente (sky-500, etc.)
- **Responsividade**: Funcionar bem em mobile e desktop
- **Acessibilidade**: Labels, aria-labels e navegação por teclado
- **Feedback**: Mensagens claras para sucesso/erro na alteração de senha

---

## 🔒 Considerações de Segurança

- ✅ **HTTPS** em produção
- ✅ **Registro público desabilitado** - usuários criados apenas pelo admin
- ✅ **Tokens** gerenciados automaticamente pelo Supabase
- ✅ **RLS** (Row Level Security) habilitado nas tabelas
- ✅ **Middleware** protegendo rotas sensíveis
- ✅ **Validação** tanto no cliente quanto no servidor
- ✅ **Alteração de senha** com validação de senha atual

---

## 📊 Métricas de Sucesso

- [ ] Usuários não autenticados não conseguem acessar páginas protegidas
- [ ] Login/logout funcionam corretamente
- [ ] Alteração de senha funciona corretamente
- [ ] Impossível criar conta sem ser admin
- [ ] Sessão persiste entre recarregamentos
- [ ] Experiência fluida sem travamentos
- [ ] Interface integrada ao design existente

---

## 👥 Gerenciamento de Usuários

### **Criação de Usuários (Apenas Admin)**
- [ ] Usuários criados via painel Supabase Auth
- [ ] Ou via SQL direto no banco
- [ ] Email e senha temporária fornecidos ao usuário
- [ ] Usuário deve alterar senha no primeiro login

### **Processo Inicial**
1. **Admin cria usuário** no painel Supabase
2. **Fornece credenciais** para o usuário
3. **Usuário faz login** com credenciais temporárias  
4. **Usuário altera senha** obrigatoriamente
5. **Usuário tem acesso completo** à plataforma

### **Remoção de Usuários**
- [ ] Apenas via painel admin Supabase
- [ ] Usuário automaticamente deslogado
- [ ] Tokens invalidados automaticamente

---

## 📚 Recursos Úteis

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Supabase Auth UI](https://supabase.com/docs/guides/auth/auth-ui/nextjs)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)

---

*Este documento serve como roadmap para implementação. Cada tarefa deve ser implementada e testada incrementalmente.*
