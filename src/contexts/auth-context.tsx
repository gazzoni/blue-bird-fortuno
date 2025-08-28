'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, getSession, signIn, signOut, updatePassword } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updatePassword: (password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se as variáveis de ambiente estão definidas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ AuthContext: Variáveis de ambiente do Supabase não encontradas!')
      setLoading(false)
      return
    }

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('🔍 AuthContext: Inicializando autenticação...')
        const session = await getSession()
        console.log('🔍 AuthContext: Sessão obtida:', !!session, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('❌ AuthContext: Erro ao obter sessão inicial:', error)
        setSession(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 AuthContext: Estado de auth mudou:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      await signIn(email, password)
      // State will be updated by the auth state change listener
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut()
      // State will be updated by the auth state change listener
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const handleUpdatePassword = async (password: string) => {
    try {
      await updatePassword(password)
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    updatePassword: handleUpdatePassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
