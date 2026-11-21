import { Link, useLocation } from 'react-router-dom'
import { Home, Users, BarChart3 } from 'lucide-react'

export default function BottomNav() {
  const location = useLocation()

  const isHome = location.pathname === '/home' || location.pathname === '/new-debt' || location.pathname === '/receive-payment'
  const isCustomers = location.pathname.startsWith('/customers')
  const isMetrics = location.pathname === '/metrics'

  return (
    <nav className="fixed bottom-0 w-full max-w-[448px] h-[70px] bg-white border-t border-slate-200 flex z-10">
      <Link
        to="/home"
        className={`flex-1 flex flex-col items-center justify-center text-xs gap-1 transition-colors ${
          isHome ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <Home size={22} strokeWidth={isHome ? 2.4 : 1.8} />
        <span>Início</span>
      </Link>

      <Link
        to="/customers"
        className={`flex-1 flex flex-col items-center justify-center text-xs gap-1 transition-colors ${
          isCustomers ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <Users size={22} strokeWidth={isCustomers ? 2.4 : 1.8} />
        <span>Clientes</span>
      </Link>

      <Link
        to="/metrics"
        className={`flex-1 flex flex-col items-center justify-center text-xs gap-1 transition-colors ${
          isMetrics ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <BarChart3 size={22} strokeWidth={isMetrics ? 2.4 : 1.8} />
        <span>Métricas</span>
      </Link>
    </nav>
  )
}