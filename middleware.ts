import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log('🔒 MIDDLEWARE EXECUTADO para:', req.nextUrl.pathname)
  
  // Criar response
  let response = NextResponse.next()

  // Páginas que não precisam de autenticação
  const publicPaths = ['/login', '/auth']
  const isPublicPath = publicPaths.some(path => req.nextUrl.pathname.startsWith(path))
  
  // Arquivos estáticos e APIs - ignorar
  const isStaticFile = 
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api/webhook') ||
    req.nextUrl.pathname === '/favicon.ico' ||
    req.nextUrl.pathname === '/robots.txt' ||
    req.nextUrl.pathname === '/manifest.json' ||
    req.nextUrl.pathname === '/sw.js' ||
    /\.(png|jpg|jpeg|gif|webp|svg|ico)$/.test(req.nextUrl.pathname)

  if (isStaticFile) {
    console.log('📁 Arquivo estático ignorado:', req.nextUrl.pathname)
    return response
  }

  // Se é página pública, continuar
  if (isPublicPath) {
    console.log('🌐 Página pública acessada:', req.nextUrl.pathname)
    return response
  }

  // Verificar variáveis de ambiente
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('❌ Variáveis de ambiente não configuradas - redirecionando para login')
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  try {
    // Criar cliente Supabase
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Verificar sessão
    const { data: { session }, error } = await supabase.auth.getSession()
    
    console.log('👤 Verificação de sessão:', {
      hasSession: !!session,
      email: session?.user?.email,
      error: error?.message
    })

    // Se não há sessão válida, redirecionar para login
    if (!session || error) {
      console.log('🚫 Sem sessão válida - redirecionando para login')
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    console.log('✅ Sessão válida - acesso liberado')
    return response

  } catch (error) {
    console.error('❌ Erro no middleware:', error)
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - static files
     * - Next.js internals
     */
    '/((?!api/|_next/|favicon.ico|robots.txt|manifest.json|sw.js).*)' 
  ],
}