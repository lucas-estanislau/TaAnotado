import { Link } from 'react-router-dom'
import { Plus, DollarSign, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAppData } from '../contexts/useAppData'

export default function Home() {
  const navigate = useNavigate()
  const { customers, transactions, totalReceivable, overdueCustomersCount } = useAppData()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  // Últimas 5 movimentações ordenadas pela data
  const recentTransactions = transactions
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
    .map((t) => {
      const cliente = customers.find((c) => c.id === t.customer_id)
      const dataObj = new Date(t.created_at)
      const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      })
      const horaFormatada = dataObj.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })

      return {
        ...t,
        customerName: cliente ? cliente.name : 'Cliente',
        subtitle: `${t.type === 'debt' ? 'Compra' : 'Pagamento'} • ${dataFormatada}, ${horaFormatada}`,
        amountFormatted: (t.amount_cents / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      }
    })

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
            {totalReceivable.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
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
        {overdueCustomersCount > 0 ? (
          <Link
            to="/customers?status=atrasado"
            className="bg-amber-100 border-l-4 border-red-600 rounded-[10px] p-3.5 text-sm font-semibold text-slate-900 flex items-center justify-between mb-5 hover:bg-amber-200/70 transition-colors"
          >
            <span>
              {overdueCustomersCount} cliente{overdueCustomersCount > 1 ? 's' : ''} atrasado{overdueCustomersCount > 1 ? 's' : ''} (há mais de 60 dias)
            </span>
            <ChevronRight size={20} className="text-slate-600 shrink-0" />
          </Link>
        ) : (
          <div className="bg-emerald-50 border-l-4 border-emerald-600 rounded-[10px] p-3 text-xs font-medium text-emerald-800 mb-5">
            Nenhum cliente com cobrança atrasada há mais de 60 dias!
          </div>
        )}

        {/* 5. Últimas Movimentações */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2.5">
            Últimas Movimentações
          </h2>

          <div className="space-y-2.5">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-6">
                Nenhuma movimentação registrada ainda.
              </p>
            ) : (
              recentTransactions.map((item) => {
                const isDebt = item.type === 'debt'
                const isCancelled = item.status === 'cancelled'

                return (
                  <div
                    key={item.id}
                    className={`bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center gap-3 ${
                      isCancelled ? 'opacity-60 bg-slate-50' : ''
                    }`}
                  >
                    {/* Ícone circular */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isCancelled
                          ? 'bg-slate-200 text-slate-500'
                          : isDebt
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
                      <b className={`block text-[15px] font-bold text-slate-900 truncate ${isCancelled ? 'line-through text-slate-500' : ''}`}>
                        {item.customerName}
                      </b>
                      <span className="text-[13px] text-slate-500">
                        {item.subtitle} {isCancelled ? '(CANCELADO)' : ''}
                      </span>
                    </div>

                    {/* Valor */}
                    <span
                      className={`font-bold tabular-nums text-[15px] ${
                        isCancelled
                          ? 'line-through text-slate-400'
                          : isDebt
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {item.amountFormatted}
                    </span>
                  </div>
                )
              })
            )}
          </div>

          <Link
            to="/customers"
            className="w-full h-12 mt-3 rounded-xl bg-white border-[1.5px] border-blue-600 text-blue-600 font-bold text-base hover:bg-blue-50 transition-colors flex items-center justify-center"
          >
            Ver todos os clientes
          </Link>
        </section>
      </main>
    </div>
  )
}
