import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useAppData } from '../contexts/useAppData'

const FILTROS = [
  { id: 'todos', label: 'Todos' },
  { id: 'em_aberto', label: 'Em Aberto' },
  { id: 'atrasado', label: 'Atrasado' },
  { id: 'pago', label: 'Pago' },
]

export default function Customers() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialStatus = searchParams.get('status') || 'todos'

  const { customers } = useAppData()
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState(initialStatus)

  const listaFiltrada = customers.filter((c) => {
    const matchNome = (c.name || '').toLowerCase().includes(busca.toLowerCase())
    if (filtro === 'todos') return matchNome
    if (filtro === 'em_aberto') return matchNome && (c.status === 'em_aberto' || c.status === 'atrasado')
    return matchNome && c.status === filtro
  })

  return (
    <div>
      <header className="bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between sticky top-0 z-10">
        <h1 className="font-bold text-lg text-slate-900">Clientes</h1>
        <button
          onClick={() => navigate('/customers/new')}
          className="h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo</span>
        </button>
      </header>

      <div className="p-4 space-y-3">
        {/* Busca */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar cliente por nome..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Filtros de Status */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filtro === f.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Lista de Clientes */}
        <div className="space-y-2.5 pt-1">
          {listaFiltrada.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-8">
              Nenhum cliente encontrado.
            </p>
          ) : (
            listaFiltrada.map((cliente) => (
              <div
                key={cliente.id}
                onClick={() => navigate(`/customers/${cliente.id}`)}
                className="bg-white rounded-xl border border-slate-200 p-3.5 flex items-center justify-between shadow-xs cursor-pointer hover:border-blue-300 transition-colors"
              >
                <div>
                  <p className="font-semibold text-slate-900 text-sm">
                    {cliente.name}
                  </p>
                  {cliente.status === 'atrasado' ? (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-red-100 text-red-700 text-[11px] font-bold">
                      {cliente.info}
                    </span>
                  ) : (
                    <p className="text-xs text-slate-500 mt-0.5">{cliente.info}</p>
                  )}
                </div>

                <div>
                  {cliente.status === 'pago' ? (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold">
                      PAGO
                    </span>
                  ) : (
                    <span
                      className={`font-bold text-sm tabular-nums ${
                        cliente.status === 'atrasado'
                          ? 'text-red-600'
                          : 'text-slate-900'
                      }`}
                    >
                      R$ {cliente.balance.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
