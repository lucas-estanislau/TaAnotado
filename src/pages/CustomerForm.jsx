import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, UserPlus } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function CustomerForm() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [erroNome, setErroNome] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function handleSalvar(e) {
    e.preventDefault()

    if (!nome.trim()) {
      setErroNome('O nome completo é obrigatório.')
      return
    }

    setErroNome('')
    setSalvando(true)

    try {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data?.user) {
        alert('Você precisa estar autenticado.')
        navigate('/login')
        return
      }

      const { error: insertError } = await supabase
        .from('customers')
        .insert([
          {
            owner_id: data.user.id,
            name: nome.trim(),
            phone: telefone.trim() || null,
            notes: observacoes.trim() || null
          }
        ])

      if (insertError) {
        console.error(insertError.message)
        alert('Erro ao cadastrar cliente.')
        return
      }

      alert('Cliente cadastrado com sucesso!')
      navigate('/customers')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="w-full px-4 pt-7 pb-8">
      {/* Botão de voltar */}
      <button
        type="button"
        onClick={() => navigate('/customers')}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 cursor-pointer mb-6"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      {/* Ícone */}
      <div className="mx-auto mb-3 grid h-[72px] w-[72px] place-items-center rounded-[20px] bg-gradient-to-br from-blue-600 to-violet-600 shadow-[0_6px_16px_rgba(37,99,235,0.3)]">
        <UserPlus size={36} className="text-white" />
      </div>

      {/* Cabeçalho */}
      <header className="text-center">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-slate-900">
          Novo cliente
        </h1>
        <p className="mt-1 mb-7 text-sm text-slate-500">
          Cadastre um cliente para controlar suas compras fiadas.
        </p>
      </header>

      {/* Formulário */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
        <form noValidate onSubmit={handleSalvar} className="flex flex-col">
          {/* Nome completo */}
          <label
            htmlFor="name"
            className="mb-1.5 mt-3.5 block text-sm font-semibold text-slate-900"
          >
            Nome completo <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={nome}
            onChange={(e) => {
              setNome(e.target.value)
              if (erroNome) setErroNome('')
            }}
            placeholder="Digite o nome do cliente"
            aria-required="true"
            aria-invalid={!!erroNome}
            aria-describedby={erroNome ? 'erro-nome' : undefined}
            className={`h-12 w-full rounded-xl border-[1.5px] bg-white px-3.5 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none ${
              erroNome
                ? 'border-red-500'
                : 'border-slate-300 focus:border-blue-600'
            }`}
          />
          {erroNome && (
            <p id="erro-nome" role="alert" className="text-red-500 text-sm mt-1">
              {erroNome}
            </p>
          )}

          {/* Telefone */}
          <label
            htmlFor="phone"
            className="mt-3.5 mb-1.5 block text-sm font-semibold text-slate-900"
          >
            Telefone/WhatsApp
            <span className="font-medium text-slate-500"> (opcional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="(84) 99999-9999"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="h-12 w-full rounded-xl border-[1.5px] border-slate-300 bg-white px-3.5 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
          />

          {/* Observações */}
          <label
            htmlFor="notes"
            className="mt-3.5 mb-1.5 block text-sm font-semibold text-slate-900"
          >
            Observações
            <span className="font-medium text-slate-500"> (opcional)</span>
          </label>
          <textarea
            id="notes"
            rows={4}
            placeholder="Adicione alguma observação"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full rounded-xl border-[1.5px] border-slate-300 bg-white px-3.5 py-2.5 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
          />

          {/* Botão de salvar */}
          <button
            type="submit"
            disabled={salvando}
            className="mt-5 h-[52px] w-full cursor-pointer rounded-xl bg-blue-600 text-base font-bold text-white transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50"
          >
            {salvando ? 'SALVANDO...' : 'SALVAR CLIENTE'}
          </button>

          {/* Botão de cancelar */}
          <button
            type="button"
            onClick={() => navigate('/customers')}
            className="mt-[18px] cursor-pointer text-center text-sm font-semibold text-slate-500 hover:text-slate-700"
          >
            Cancelar
          </button>
        </form>
      </section>
    </div>
  )
}
