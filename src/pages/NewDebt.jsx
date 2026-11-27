import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Search, UserPlus, Check } from 'lucide-react'
import { useAppData } from '../contexts/useAppData'

export default function NewDebt() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedId = Number(searchParams.get('clienteId'))

  const { customers, addDebt } = useAppData()

  const [busca, setBusca] = useState('')
  const [clienteSelecionado, setClienteSelecionado] = useState(
    customers.find((c) => c.id === preselectedId) || null
  )
  const [valor, setValor] = useState('')
  const [descricao, setDescricao] = useState('')
  const [erro, setErro] = useState('')

  const clientesFiltrados = customers.filter((c) =>
    (c.name || '').toLowerCase().includes(busca.toLowerCase())
  )

  const handleConfirmar = (e) => {
    e.preventDefault()
    if (!clienteSelecionado) {
      setErro('Selecione um cliente para o fiado.')
      return
    }

    const valorLimpo = parseFloat(valor.replace(',', '.'))
    if (!valorLimpo || valorLimpo <= 0) {
      setErro('Informe um valor válido maior que zero.')
      return
    }

    const amount_cents = Math.round(valorLimpo * 100)
    addDebt({
      customer_id: clienteSelecionado.id,
      amount_cents,
      description: descricao,
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
        <h1 className="font-bold text-lg text-blue-600">Novo Fiado</h1>
      </header>

      <form onSubmit={handleConfirmar} className="p-4 space-y-5">
        {/* Passo 1: Cliente */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <label className="block text-sm font-bold text-slate-800">
            1. Cliente
          </label>

          {clienteSelecionado ? (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <div>
                <p className="font-bold text-sm text-blue-950">
                  {clienteSelecionado.name}
                </p>
                <p className="text-xs text-blue-700">
                  Saldo atual: R$ {clienteSelecionado.balance.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setClienteSelecionado(null)}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Trocar
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar nome do cliente..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {busca && (
                <div className="border border-slate-200 rounded-xl max-h-40 overflow-y-auto divide-y divide-slate-100">
                  {clientesFiltrados.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setClienteSelecionado(c)
                        setBusca('')
                        setErro('')
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-sm hover:bg-slate-50 flex items-center justify-between"
                    >
                      <span className="font-medium text-slate-800">{c.name}</span>
                      <span className="text-xs text-slate-500">
                        Saldo: R$ {c.balance.toFixed(2).replace('.', ',')}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => navigate('/customers/new')}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-violet-400 bg-violet-50 text-violet-700 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-violet-100 transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Cadastrar novo cliente</span>
              </button>
            </div>
          )}
        </div>

        {/* Passo 2: Valor */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
          <label className="block text-sm font-bold text-slate-800">
            2. Valor (R$)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-lg text-slate-400">
              R$
            </span>
            <input
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => {
                setValor(e.target.value)
                setErro('')
              }}
              placeholder="0,00"
              className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-300 text-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Passo 3: Descrição */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
          <label className="block text-sm font-bold text-slate-800">
            3. Descrição <span className="text-xs font-normal text-slate-400">(opcional)</span>
          </label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Pão, leite e café"
            className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {erro && (
          <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-xl">
            {erro}
          </p>
        )}

        <button
          type="submit"
          className="w-full h-14 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Check className="w-5 h-5" strokeWidth={2.5} />
          <span>CONFIRMAR FIADO</span>
        </button>
      </form>
    </div>
  )
}
