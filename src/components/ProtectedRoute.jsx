import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/**
 * Garante que apenas usuários autenticados acessem as rotas internas.
 * Redireciona para /login caso não haja sessão ativa.
 */
export default function ProtectedRoute() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session)
        setLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-semibold text-slate-500">
        Carregando...
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
