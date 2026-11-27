import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, DollarSign } from 'lucide-react'
import { useAppData } from '../contexts/useAppData'

export default function CustomerDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { customers, transactions, cancelTransaction } = useAppData()

  const cliente = customers.find((c) => c.id === Number(id))
  const customerId = cliente ? cliente.id : Number(id) || 1

  // Filtra transações deste cliente
  const historico = transactions
    .filter((t) => t.customer_id === customerId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const saldoAtual = cliente ? cliente.balance : 0

  const handleCancelarLancamento = (lancamentoId) => {
    if (
      !window.confirm(
        'Deseja cancelar este lançamento? Ele permanecerá no histórico como cancelado e o saldo será recalculado.'
      )
    ) {
      return
    }
    cancelTransaction(lancamentoId)
  }

  return (
    <div>
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/customers')}
            className="p-1.5 -ml-1.5 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-base text-slate-900 leading-tight">
              {cliente ? cliente.name : 'Cliente'}
            </h1>
            <p className="text-xs text-slate-500">
              {cliente?.phone || 'Sem telefone'}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/customers/${customerId}/editar`)}
          className="text-sm font-semibold text-blue-600 hover:underline px-2 py-1 cursor-pointer"
        >
          Editar
        </button>
      </header>

      <div className="p-4 space-y-4">
        {/* Saldo em Destaque */}
        <div className="bg-white rounded-2xl border-2 border-violet-200 p-4 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Saldo Devedor Atual
          </p>
          <p className="text-3xl font-bold text-slate-900 mt-1 tabular-nums">
            R$ {saldoAtual.toFixed(2).replace('.', ',')}
          </p>
          {cliente?.notes && (
            <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg">
              Obs: {cliente.notes}
            </p>
          )}
        </div>

        {/* Botões de Ação com Cliente Pré-selecionado */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate(`/new-debt?clienteId=${customerId}`)}
            className="h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>NOVO FIADO</span>
          </button>

          <button
            onClick={() => navigate(`/receive-payment?clienteId=${customerId}`)}
            className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <DollarSign className="w-4 h-4" />
            <span>RECEBER</span>
          </button>
        </div>

        {/* Histórico de Lançamentos */}
        <section className="pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Histórico de Lançamentos
          </h2>

          <div className="space-y-2.5">
            {historico.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-6">
                Nenhum lançamento para este cliente.
              </p>
            ) : (
              historico.map((item) => {
                const isCompra = item.type === 'debt'
                const valorReais = item.amount_cents / 100
                const dt = new Date(item.created_at)
                const dataFormatada = dt.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                })

                if (item.status === 'cancelled') {
                  return (
                    <div
                      key={item.id}
                      className="bg-slate-100 rounded-xl border border-slate-200 p-3.5 flex items-center justify-between opacity-75"
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-500 line-through">
                          {isCompra ? 'Compra' : 'Pagamento'} (CANCELADO) • {dataFormatada}
                        </p>
                        <p className="text-xs text-slate-400 line-through mt-0.5">
                          {item.description || 'Sem descrição'}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-slate-400 line-through tabular-nums">
                        R$ {valorReais.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  )
                }

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {isCompra ? 'Compra' : 'Pagamento'}{' '}
                          <span className="font-normal text-xs text-slate-500">
                            • {dataFormatada}
                          </span>
                        </p>
                        {item.description && (
                          <p className="text-xs text-slate-600 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <span
                        className={`font-bold text-sm tabular-nums ${
                          isCompra ? 'text-red-600' : 'text-emerald-600'
                        }`}
                      >
                        R$ {valorReais.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => handleCancelarLancamento(item.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
                      >
                        Cancelar lançamento
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
