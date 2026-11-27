import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAppData } from '../contexts/useAppData'

export default function Metrics() {
  const { totalReceivable, transactions } = useAppData()
  const [indiceMes, setIndiceMes] = useState(1)

  // Calcula total lançado e total recebido no mês corrente dos dados
  const activeTxs = transactions.filter((t) => t.status === 'active')
  const totalLancadoMes = activeTxs
    .filter((t) => t.type === 'debt')
    .reduce((acc, t) => acc + t.amount_cents, 0) / 100

  const totalRecebidoMes = activeTxs
    .filter((t) => t.type === 'payment')
    .reduce((acc, t) => acc + t.amount_cents, 0) / 100

  const MESES = [
    {
      label: 'Outubro / 2026',
      recebido: 2089.0,
      varRecebido: '+4% em relação a Setembro',
      lancado: 2221.0,
      varLancado: '+8% em relação a Setembro',
      aReceber: totalReceivable,
    },
    {
      label: 'Novembro / 2026',
      recebido: totalRecebidoMes || 2340.0,
      varRecebido: '+12% em relação a Outubro',
      lancado: totalLancadoMes || 2110.0,
      varLancado: '-5% em relação a Outubro',
      aReceber: totalReceivable,
    },
  ]

  const dados = MESES[indiceMes]

  const formatBRL = (val) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div>
      <header className="bg-white border-b border-slate-200 px-4 h-14 flex items-center sticky top-0 z-10">
        <h1 className="font-bold text-lg text-slate-900">Métricas</h1>
      </header>

      <div className="p-4 space-y-4">
        {/* Seletor de Mês */}
        <div className="bg-white rounded-xl border border-slate-200 p-2 flex items-center justify-between shadow-xs">
          <button
            type="button"
            disabled={indiceMes === 0}
            onClick={() => setIndiceMes((i) => Math.max(0, i - 1))}
            className="p-2 text-blue-600 disabled:text-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="font-bold text-sm text-blue-600">{dados.label}</span>

          <button
            type="button"
            disabled={indiceMes === MESES.length - 1}
            onClick={() => setIndiceMes((i) => Math.min(MESES.length - 1, i + 1))}
            className="p-2 text-blue-600 disabled:text-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Card 1: Total Recebido */}
        <div className="bg-white rounded-xl border-l-4 border-l-emerald-600 border border-slate-200 p-4 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Recebido no Mês
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
            {formatBRL(dados.recebido)}
          </p>
          <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            {dados.varRecebido}
          </span>
        </div>

        {/* Card 2: Total Lançado */}
        <div className="bg-white rounded-xl border-l-4 border-l-blue-600 border border-slate-200 p-4 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Lançado (Fiado no Mês)
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1 tabular-nums">
            {formatBRL(dados.lancado)}
          </p>
          <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
            {dados.varLancado}
          </span>
        </div>

        {/* Card 3: Saldo Atual a Receber */}
        <div className="bg-white rounded-xl border-l-4 border-l-violet-600 border border-slate-200 p-4 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Saldo Total a Receber (Atual)
          </p>
          <p className="text-2xl font-bold text-violet-600 mt-1 tabular-nums">
            {formatBRL(dados.aReceber)}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Soma de todos os clientes em aberto
          </p>
        </div>
      </div>
    </div>
  )
}
