import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Check, X } from 'lucide-react'
import { useAppData } from '../contexts/useAppData'

export default function ReceivePayment() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedId = Number(searchParams.get('clienteId'))

  const { customers, addPayment } = useAppData()

  const [clienteSelecionado, setClienteSelecionado] = useState(
    customers.find((c) => c.id === preselectedId) || customers.find((c) => c.balance > 0) || customers[0] || null
  )
  const [valorRecebido, setValorRecebido] = useState('')
  const [erro, setErro] = useState('')

  const saldoAtual = clienteSelecionado ? clienteSelecionado.balance : 0
  const valorNum = parseFloat(valorRecebido.replace(',', '.')) || 0
  const saldoRestante = Math.max(0, saldoAtual - valorNum)

  const handleQuitarTudo = () => {
    if (clienteSelecionado) {
      setValorRecebido(clienteSelecionado.balance.toFixed(2))
      setErro('')
    }
  }

  const handleConfirmar = (e) => {
    e.preventDefault()
    if (!clienteSelecionado) {
      setErro('Selecione um cliente.')
      return
    }

    if (valorNum <= 0) {
      setErro('Informe um valor de pagamento válido.')
      return
    }

    const amount_cents = Math.round(valorNum * 100)
    addPayment({
      customer_id: clienteSelecionado.id,
      amount_cents,
      description: 'Pagamento recebido',
    })

    navigate(`/customers/${clienteSelecionado.id}`)
  }

  return (
    <div>
      <header className="bg-white border-b border-slate-200 px-4 h-14 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 -ml-1.5 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-lg text-slate-900">Receber Pagamento</h1>
      </header>

      <form onSubmit={handleConfirmar} className="p-4 space-y-5">
        {/* Passo 1: Cliente Selecionado */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <label className="block text-sm font-bold text-slate-800">
            1. Cliente
          </label>

          {clienteSelecionado ? (
            <div>
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <b className="text-slate-900 text-sm block">{clienteSelecionado.name}</b>
                  <span className="text-xs text-slate-500">{clienteSelecionado.phone || 'Sem telefone'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setClienteSelecionado(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Pílula de Saldo Devedor Atual */}
              <div className="mt-3 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl">
                <span className="text-xs text-slate-500 font-medium block">
                  Saldo devedor atual
                </span>
                <span className="text-2xl font-bold text-blue-600 tabular-nums">
                  R$ {saldoAtual.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
              {customers
                .filter((c) => c.balance > 0)
                .map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setClienteSelecionado(c)
                      setErro('')
                    }}
                    className="w-full text-left p-3 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium text-sm text-slate-900">{c.name}</span>
                    <span className="text-xs font-bold text-red-600">
                      R$ {c.balance.toFixed(2).replace('.', ',')}
                    </span>
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Passo 2: Valor Recebido */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <label className="block text-sm font-bold text-slate-800">
            2. Valor Recebido (R$)
          </label>

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-lg text-slate-400">
              R$
            </span>
            <input
              type="number"
              step="0.01"
              value={valorRecebido}
              onChange={(e) => {
                setValorRecebido(e.target.value)
                setErro('')
              }}
              placeholder="0,00"
              className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-300 text-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <button
            type="button"
            onClick={handleQuitarTudo}
            className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            Quitar tudo
          </button>

          <p className="text-xs text-slate-600 text-center pt-1">
            Saldo restante após pagamento:{' '}
            <b className="text-slate-900 tabular-nums">
              R$ {saldoRestante.toFixed(2).replace('.', ',')}
            </b>
          </p>
        </div>

        {erro && (
          <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-xl">
            {erro}
          </p>
        )}

        <button
          type="submit"
          className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Check className="w-5 h-5" strokeWidth={2.5} />
          <span>CONFIRMAR PAGAMENTO</span>
        </button>
      </form>
    </div>
  )
}
