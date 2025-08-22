-- Script para alterar a tabela documents existente
-- Execute no Supabase SQL Editor

-- 1. Verificar estrutura atual da tabela
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'documents' AND table_schema = 'public';

-- 2. Alterar colunas existentes (se necessário)
-- Renomear colunas se estiverem com nomes diferentes

-- Se a coluna 'name' existir, renomear para 'document_name'
-- ALTER TABLE documents RENAME COLUMN name TO document_name;

-- Se a coluna 'content' existir, renomear para 'document_content'  
-- ALTER TABLE documents RENAME COLUMN content TO document_content;

-- Se a coluna 'type' existir, renomear para 'origin_type'
-- ALTER TABLE documents RENAME COLUMN type TO origin_type;

-- Se a coluna 'status' existir, renomear para 'origin_status'
-- ALTER TABLE documents RENAME COLUMN status TO origin_status;

-- 3. Adicionar colunas que podem estar faltando
-- Adicionar coluna document_name se não existir
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS document_name TEXT NOT NULL DEFAULT 'Documento sem nome';

-- Adicionar coluna document_content se não existir
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS document_content TEXT;

-- Adicionar coluna transcript se não existir
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS transcript TEXT;

-- Adicionar coluna origin_type se não existir
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS origin_type TEXT DEFAULT 'TRANSCRIPT';

-- Adicionar coluna origin_status se não existir
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS origin_status TEXT DEFAULT 'running';

-- 4. Remover constraints antigas se existirem
DROP CONSTRAINT IF EXISTS documents_origin_type_check;
DROP CONSTRAINT IF EXISTS documents_origin_status_check;

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 6. Criar política para permitir todas as operações (sem autenticação)
DROP POLICY IF EXISTS "Allow all operations" ON documents;
CREATE POLICY "Allow all operations" ON documents 
FOR ALL USING (true);

-- 7. Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS documents;

-- 8. Verificar estrutura final
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'documents' AND table_schema = 'public'
ORDER BY ordinal_position;
