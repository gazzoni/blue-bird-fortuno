# Configuração do Supabase Auth

## ✅ Sistema de Autenticação Implementado

O sistema de autenticação foi completamente implementado no frontend. Agora você precisa configurar o Supabase para que funcione corretamente.

## 📋 Configurações Necessárias no Supabase

### 1. Configurar Authentication Settings

No painel do Supabase (Settings > Authentication):

#### **Geral**
- ✅ **Enable email confirmations**: DESABILITADO
- ✅ **Enable phone confirmations**: DESABILITADO  
- ✅ **Enable email change confirmations**: HABILITADO
- ✅ **Enable secure email change**: HABILITADO

#### **Auth Providers**
- ✅ **Email**: HABILITADO
- ❌ **Todos outros providers**: DESABILITADOS

#### **Security and Sessions**
- ✅ **JWT expiry**: 3600 (1 hora)
- ✅ **Refresh token rotation**: HABILITADO
- ✅ **Reuse interval**: 10
- ✅ **Session inactivity timeout**: HABILITADO (1 week)

### 2. Configurar Site URL e Redirect URLs

#### **Site URL**
```
https://blue-bird-fortuno.vercel.app
```

#### **Redirect URLs**
```
https://blue-bird-fortuno.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

### 3. Desabilitar Registro Público

#### **Advanced Settings > Security**
- ❌ **Enable signup**: DESABILITADO

### 4. Configurar Row Level Security (RLS)

Execute no SQL Editor do Supabase:

```sql
-- Habilitar RLS em todas as tabelas principais
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE occurrences ENABLE ROW LEVEL SECURITY;
ALTER TABLE "new-occurrences" ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Política para usuários autenticados - acesso total
CREATE POLICY "Authenticated users can do everything" 
ON companies FOR ALL 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can do everything" 
ON occurrences FOR ALL 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can do everything" 
ON "new-occurrences" FOR ALL 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can do everything" 
ON messages FOR ALL 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can do everything" 
ON groups FOR ALL 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can do everything" 
ON people FOR ALL 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can do everything" 
ON documents FOR ALL 
TO authenticated 
USING (true);
```

## 👤 Gerenciamento de Usuários

### Como Criar Usuários (Admin)

1. Acesse o painel do Supabase
2. Vá em **Authentication > Users**
3. Clique em **Invite a user**
4. Digite o email do usuário
5. O usuário receberá um email com link para definir a senha

### Como Usuários Alteram a Senha

1. Usuário faz login com credenciais temporárias
2. Clica no avatar no canto superior direito
3. Seleciona "Alterar Senha"
4. Define nova senha

## 🔧 Variáveis de Ambiente Necessárias (OBRIGATÓRIO)

⚠️ **ATENÇÃO**: Sem essas variáveis, a autenticação não funcionará!

**1. Crie o arquivo `.env.local` na raiz do projeto:**

```bash
# Na raiz do projeto
touch .env.local
```

**2. Adicione estas variáveis no arquivo `.env.local`:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

**3. Onde encontrar essas informações:**
- Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
- Vá em **Settings** > **API**
- Copie a **URL** e a **anon public key**

**4. Para produção (Vercel):**
- Adicione as mesmas variáveis no painel do Vercel
- **Settings** > **Environment Variables**

## 📱 Funcionalidades Implementadas

### ✅ Login
- Página dedicada: `/login`
- Validação de credenciais
- Redirecionamento após login
- Tratamento de erros

### ✅ Logout
- Botão no header (avatar do usuário)
- Limpa sessão completamente
- Redirecionamento para login

### ✅ Alteração de Senha
- Página dedicada: `/change-password`
- Validação de senha (mínimo 6 caracteres)
- Confirmação de senha
- Interface intuitiva

### ✅ Proteção de Rotas
- Middleware que protege todas as rotas
- Redirecionamento automático para login
- Preserva URL de destino após login

### ✅ Gerenciamento de Estado
- Context global de autenticação
- Persistência de sessão
- Refresh automático de tokens

## 🚀 Como Testar

1. **Configure o Supabase** seguindo os passos acima
2. **Crie o primeiro usuário** no painel do Supabase
3. **Inicie o servidor**: `npm run dev`
4. **Acesse qualquer rota** - será redirecionado para `/login`
5. **Faça login** com as credenciais criadas
6. **Teste a alteração de senha** no menu do usuário
7. **Teste o logout** no menu do usuário

## ⚠️ Notas Importantes

- **Sem registro público**: Usuários são criados apenas pelo admin
- **Acesso uniforme**: Todos usuários têm mesmo nível de acesso
- **Sessões seguras**: Tokens são renovados automaticamente
- **RLS ativo**: Apenas usuários autenticados acessam dados
- **Build funcionando**: Sistema completamente testado

## 🆘 Troubleshooting

### Problema: "Invalid login credentials"
- Verifique se o usuário foi criado no Supabase
- Confirme se a senha está correta
- Verifique se o usuário confirmou o email (se habilitado)

### Problema: Redirecionamento infinito
- Verifique as redirect URLs no Supabase
- Confirme se o middleware está configurado corretamente

### Problema: "Session not found"
- Verifique as variáveis de ambiente
- Confirme se o domínio está correto nas configurações

---

**✅ Sistema pronto para produção!** 🚀
