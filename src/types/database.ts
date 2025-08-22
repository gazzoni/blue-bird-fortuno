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
  chat_id: string;
  chat_name: string;
  client_name: string;
  occurrence_name: string;
  status: string;
  description: string;
  occurrence_resolution: string;
  key_words: string;
  messages: Record<string, unknown>; // jsonb
  channel: string;
  gate_kepper: boolean;
  squad: string;
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
  participants: Record<string, unknown>; // jsonb
}

export interface People {
  id: number;
  created_at: string;
  push_name: string;
  chat_id: string;
}

export interface Document {
  id: number;
  created_at: string;
  document_name: string;
  document_content?: string; // markdown gerado
  transcript?: string; // transcript original
  origin_type: 'TRANSCRIPT' | 'MEDIA';
  origin_status: 'running' | 'completed' | 'error';
}