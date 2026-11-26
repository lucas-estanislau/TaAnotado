import { Link, useNavigate } from 'react-router-dom'
import { Plus, DollarSign, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react'
import { supabase } from '../lib/supabase'

// Dados fictícios temporários (baseados no seu protótipo) antes de conectar ao Supabase
const RECENT_TRANSACTIONS = [
  {
    id: 1,
    customer: 'Maria Silva',
    type: 'debt',
    subtitle: 'Compra • Hoje, 10:15',
    amount: 'R$ 42,00',
  },
  {
    id: 2,
    customer: 'João Santos',
    type: 'payment',
    subtitle: 'Pagamento • Ontem',
    amount: 'R$ 100,00',
  },
  {
    id: 3,
    customer: 'Carlos Oliveira',
    type: 'debt',
    subtitle: 'Compra • 14/11',
    amount: 'R$ 18,50',
  },
]

export default function Home() {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Cabeçalho superior */}
      <header className="bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between">
        <span className="text-blue-600 text-xl font-extrabold tracking-tight">
          TaAnotado
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="text-slate-500 hover:text-slate-700 text-sm font-semibold cursor-pointer"
        >
          Sair
        </button>
      </header>

      {/* Conteúdo principal */}
      <main className="p-4">
        {/* 2. Card Hero - Total a Receber */}
        <section className="rounded-2xl p-5 text-white bg-gradient-to-br from-blue-600 to-purple-600 shadow-sm">
          <p className="text-xs font-semibold tracking-wider opacity-90 uppercase">
            Total a Receber
          </p>
          <p className="text-4xl font-bold tabular-nums mt-1">
            R$ 1.485,50
          </p>
        </section>

        {/* 3. Botões de ação rápida */}
        <section className="flex gap-3 my-4">
          <Link
            to="/new-debt"
            className="flex-1 h-14 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-[15px] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>NOVO FIADO</span>
          </Link>

          <Link
            to="/receive-payment"
            className="flex-1 h-14 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-[15px] flex items-center justify-center gap-1.5 transition-colors"
          >
            <DollarSign size={20} strokeWidth={2.5} />
            <span>RECEBER</span>
          </Link>
        </section>

        {/* 4. Alerta de clientes atrasados */}
        <Link
          to="/customers"
          className="bg-amber-100 border-l-4 border-red-600 rounded-[10px] p-3.5 text-sm font-semibold text-slate-900 flex items-center justify-between mb-5 hover:bg-amber-200/70 transition-colors"
        >
          <span>3 clientes atrasados (há mais de 60 dias)</span>
          <ChevronRight size={20} className="text-slate-600 shrink-0" />
        </Link>

        {/* 5. Últimas Movimentações */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2.5">
            Últimas Movimentações
          </h2>

          <div className="space-y-2.5">
            {RECENT_TRANSACTIONS.map((item) => {
              const isDebt = item.type === 'debt'

              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center gap-3"
                >
                  {/* Ícone circular */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isDebt
                        ? 'bg-red-100 text-red-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {isDebt ? (
                      <ArrowUp size={20} strokeWidth={2.5} />
                    ) : (
                      <ArrowDown size={20} strokeWidth={2.5} />
                    )}
                  </div>

                  {/* Nome e descrição */}
                  <div className="flex-1 min-w-0">
                    <b className="block text-[15px] font-bold text-slate-900 truncate">
                      {item.customer}
                    </b>
                    <span className="text-[13px] text-slate-500">
                      {item.subtitle}
                    </span>
                  </div>

                  {/* Valor */}
                  <span
                    className={`font-bold tabular-nums text-[15px] ${
                      isDebt ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {item.amount}
                  </span>
                </div>
              )
            })}
          </div>

          <button
            type="button"
            className="w-full h-12 mt-3 rounded-xl bg-white border-[1.5px] border-blue-600 text-blue-600 font-bold text-base hover:bg-blue-50 transition-colors cursor-pointer"
          >
            Carregar mais...
          </button>
        </section>
      </main>
    </div>
  )
}
