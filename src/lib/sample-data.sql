-- Execute este SQL no Supabase para criar dados de exemplo
-- Vá em https://supabase.com → seu projeto → SQL Editor → New query → Cole este código → Run

-- Inserir dados de exemplo na tabela occurrences
INSERT INTO occurrences (
  id, justification, evidence, key_words, chat_type, chat_id, chat_name, 
  channel, status, category, created_at
) VALUES 
  (1, 'Linguagem ofensiva detectada', 'Mensagem contém termos inadequados', 'ofensa, linguagem imprópria', 'group', '120363043899842108@g.us', 'Grupo Marketing', 'WhatsApp', 'Pendente', 'Conduta', '2025-08-11 14:30:00'),
  (2, 'Possível spam detectado', 'Múltiplas mensagens repetidas', 'spam, repetição', 'private', '5511999887766', 'João Silva', 'WhatsApp', 'Em Andamento', 'Segurança', '2025-08-11 13:15:00'),
  (3, 'Vazamento de informação confidencial', 'Compartilhamento de dados internos', 'confidencial, dados internos', 'group', '120363043899842109@g.us', 'Suporte Técnico', 'WhatsApp', 'Concluído', 'Segurança', '2025-08-10 16:45:00'),
  (4, 'Conversa durante horário não permitido', 'Mensagens enviadas fora do expediente', 'horário, expediente', 'private', '5511888776655', 'Maria Santos', 'WhatsApp', 'Pendente', 'Política', '2025-08-10 22:30:00'),
  (5, 'Email suspeito detectado', 'Anexo potencialmente malicioso', 'malware, anexo suspeito', 'email', 'contato@empresa.com', 'Contato Empresa', 'email', 'Em Andamento', 'Segurança', '2025-08-09 10:20:00'),
  (6, 'Assédio reportado', 'Comportamento inadequado reportado', 'assédio, comportamento', 'private', '5511777665544', 'Pedro Costa', 'WhatsApp', 'Concluído', 'Conduta', '2025-08-08 15:10:00'),
  (7, 'Uso inadequado do sistema', 'Acesso não autorizado detectado', 'acesso, não autorizado', 'group', '120363043899842110@g.us', 'Grupo RH', 'WhatsApp', 'Pendente', 'Segurança', '2025-08-07 09:00:00'),
  (8, 'Email de phishing identificado', 'Tentativa de roubo de credenciais', 'phishing, credenciais', 'email', 'suporte@falso.com', 'Email Suspeito', 'email', 'Concluído', 'Segurança', '2025-08-06 11:30:00');

-- Inserir alguns dados na tabela companies (opcional)
INSERT INTO companies (id, nome, tipo, chat_id, empresa, created_at) VALUES 
  (1, 'Empresa ABC', 'Matriz', '120363043899842108@g.us', 1, '2025-08-01 10:00:00'),
  (2, 'Filial São Paulo', 'Filial', '120363043899842109@g.us', 1, '2025-08-01 10:00:00');

-- Inserir alguns dados na tabela groups (opcional)  
INSERT INTO groups (id, subject, group_id, empresa, participants, created_at) VALUES
  (1, 'Grupo Marketing', '120363043899842108@g.us', 1, '{"members": ["user1", "user2", "user3"]}', '2025-08-01 10:00:00'),
  (2, 'Suporte Técnico', '120363043899842109@g.us', 1, '{"members": ["admin", "suporte1", "suporte2"]}', '2025-08-01 10:00:00');

-- Inserir alguns dados na tabela people (opcional)
INSERT INTO people (id, push_name, chat_id, created_at) VALUES
  (1, 'João Silva', '5511999887766', '2025-08-01 10:00:00'),
  (2, 'Maria Santos', '5511888776655', '2025-08-01 10:00:00'),
  (3, 'Pedro Costa', '5511777665544', '2025-08-01 10:00:00');