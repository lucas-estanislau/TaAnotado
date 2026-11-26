import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-blue-100 text-2xl font-extrabold text-blue-600">
        404
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900">
        Página não encontrada
      </h1>
      <p className="mt-2 mb-6 text-sm text-slate-500">
        A rota que você tentou acessar não existe ou foi removida.
      </p>
      <Link
        to="/home"
        className="flex h-12 w-full max-w-xs items-center justify-center rounded-xl bg-blue-600 font-bold text-white transition-colors hover:bg-blue-700"
      >
        Voltar para o início
      </Link>
    </div>
  )
}
