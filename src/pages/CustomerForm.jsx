import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function CustomerForm() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [erroNome, setErroNome] = useState('')

  function handleSalvar(e) {
    e.preventDefault()

    if (!nome.trim()) {
      setErroNome('O nome completo é obrigatório.')
      return
    }

    setErroNome('')

    // TODO: Integrar o cadastro de clientes ao Supabase
    // após a configuração do banco de dados.

    alert('Formulário validado com sucesso!')
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">

      <button
        type="button"
        onClick={() => navigate('/customers')}
        className="flex items-center gap-2 text-slate-700 mb-6"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Cadastrar cliente
      </h1>

      <form noValidate onSubmit={handleSalvar} className="flex flex-col gap-5">

        <div>
          <label htmlFor="name" className="block mb-2 font-medium">
            Nome completo *
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
            aria-invalid={!!erroNome}
            aria-describedby={erroNome ? 'erro-nome' : undefined}
            className={`w-full border rounded-lg p-3 ${
              erroNome
                ? 'border-red-500'
                : 'border-slate-300'
            }`}
          />

          {erroNome && (
            <p id="erro-nome" role="alert" className="text-red-500 text-sm mt-1">
              {erroNome}
            </p>
          )}

        </div>

        <div>
          <label htmlFor="phone" className="block mb-2 font-medium">
            Telefone/WhatsApp (opcional)
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="(84) 99999-9999"
            className="w-full border border-slate-300 rounded-lg p-3"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="notes" className="block mb-2 font-medium">
            Observações (opcional)
          </label>
          <textarea
            id="notes"
            rows={4}
            placeholder="Adicione alguma observação"
            className="w-full border border-slate-300 rounded-lg p-3"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg p-3 font-semibold disabled:opacity-60"
        >
          Salvar cliente
        </button>

        <button
          type="button"
          onClick={() => navigate('/customers')}
          className="border border-slate-300 rounded-lg p-3 font-semibold"
        >
          Cancelar
        </button>

      </form>
    </div>
  )
}