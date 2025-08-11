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
  participants: Record<string, unknown>; // jsonb
}

export interface People {
  id: number;
  created_at: string;
  push_name: string;
  chat_id: string;
}