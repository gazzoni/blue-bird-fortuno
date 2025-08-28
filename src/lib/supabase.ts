import { createClient } from '@supabase/supabase-js'
import type { Company, Occurrence, Message, Group, People } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database functions
export const getCompanies = async (): Promise<Company[]> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const getOccurrences = async (): Promise<Occurrence[]> => {
  const { data, error } = await supabase
    .from('occurrences')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const getMessages = async (): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const getGroups = async (): Promise<Group[]> => {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const getPeople = async (): Promise<People[]> => {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const updateOccurrenceStatus = async (id: number, status: string): Promise<void> => {
  const { error } = await supabase
    .from('new-occurrences')
    .update({ status })
    .eq('id', id)
  
  if (error) throw error
}

export const updateOccurrenceDescription = async (id: number, description: string): Promise<void> => {
  const { error } = await supabase
    .from('new-occurrences')
    .update({ description })
    .eq('id', id)
  
  if (error) throw error
}

export const updateOccurrenceName = async (id: number, occurrence_name: string): Promise<void> => {
  const { error } = await supabase
    .from('new-occurrences')
    .update({ occurrence_name })
    .eq('id', id)
  
  if (error) throw error
}

export const updateOccurrenceResolution = async (id: number, occurrence_resolution: string): Promise<void> => {
  const { error } = await supabase
    .from('new-occurrences')
    .update({ occurrence_resolution })
    .eq('id', id)
  
  if (error) throw error
}

// Auth functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const updatePassword = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password
  })
  
  if (error) throw error
  return data
}

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}