import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const MINIMO_SENHA = 6;

function emailEhValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login() {
  const navigate = useNavigate();
  const [modoCadastro, setModoCadastro] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/home", { replace: true });
      }
    });
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();

    const nomeFormatado = nome.trim();
    const emailFormatado = email.trim();
    const senhaFormatada = senha.trim();

    if (modoCadastro && !nomeFormatado) {
      setMensagem({
        tipo: "erro",
        texto: "Informe seu nome completo!",
      });
      return;
    }

    if (!emailFormatado || !senhaFormatada) {
      setMensagem({
        tipo: "erro",
        texto: "Preencha o e-mail e a senha para continuar!",
      });
      return;
    }

    if (!emailEhValido(emailFormatado)) {
      setMensagem({
        tipo: "erro",
        texto: "Digite um e-mail válido!",
      });
      return;
    }

    if (senhaFormatada.length < MINIMO_SENHA) {
      setMensagem({
        tipo: "erro",
        texto: `A senha deve ter pelo menos ${MINIMO_SENHA} caracteres.`,
      });
      return;
    }

    setCarregando(true);

    try {
      // CADASTRO
      if (modoCadastro) {
        const { error } = await supabase.auth.signUp({
          email: emailFormatado,
          password: senhaFormatada,
          options: {
            data: {
              nome: nomeFormatado,
            },
          },
        });

        if (error) {
          setMensagem({ tipo: "erro", texto: error.message });
          return;
        }

        setMensagem({
          tipo: "sucesso",
          texto: "Cadastro realizado com sucesso! Você já pode entrar.",
        });
        setModoCadastro(false);
        return;
      }

      // LOGIN
      const { error } = await supabase.auth.signInWithPassword({
        email: emailFormatado,
        password: senhaFormatada,
      });

      if (error) {
        setMensagem({ tipo: "erro", texto: error.message });
        return;
      }

      // Redireciona para a tela inicial
      navigate("/home");
    } finally {
      setCarregando(false);
    }
  }

  function alternarModo() {
    setModoCadastro((prev) => !prev);
    setMensagem(null);
  }

  return (
    <div className="w-full px-4 pt-7 pb-8">
      {/* Logo e identidade do TaAnotado */}
      <div className="mx-auto mb-3 grid h-[72px] w-[72px] place-items-center rounded-[20px] bg-gradient-to-br from-blue-600 to-violet-600 shadow-[0_6px_16px_rgba(37,99,235,0.3)]">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6z" />
          <path d="M6 3v18M10 9.5l2 2 4-4" />
        </svg>
      </div>

      <header className="text-center">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-slate-900">
          TaAnotado
        </h1>
        <p className="mt-1 mb-7 text-sm text-slate-500">
          Controle rápido de fiado para o seu comércio
        </p>
      </header>

      {/* Card do formulário */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
        <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
          {/* Campo nome: aparece somente no cadastro */}
          {modoCadastro && (
            <>
              <label
                htmlFor="nome-login"
                className="mb-1.5 block text-sm font-semibold text-slate-900"
              >
                Nome completo
              </label>
              <input
                id="nome-login"
                type="text"
                placeholder="Digite seu nome completo"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (mensagem) setMensagem(null);
                }}
                className="h-12 w-full rounded-xl border-[1.5px] border-slate-300 bg-white px-3.5 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
              />
            </>
          )}

          <label
            htmlFor="email-login"
            className="mb-1.5 mt-3.5 block text-sm font-semibold text-slate-900"
          >
            E-mail
          </label>
          <input
            id="email-login"
            type="email"
            placeholder="dono@mercearia.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (mensagem) setMensagem(null);
            }}
            className="h-12 w-full rounded-xl border-[1.5px] border-slate-300 bg-white px-3.5 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
          />

          <label
            htmlFor="senha-login"
            className="mt-3.5 mb-1.5 block text-sm font-semibold text-slate-900"
          >
            Senha
          </label>

          <div className="relative flex items-center">
            <input
              id="senha-login"
              type={mostrarSenha ? "text" : "password"}
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                if (mensagem) setMensagem(null);
              }}
              className="h-12 w-full rounded-xl border-[1.5px] border-slate-300 bg-white pr-12 pl-3.5 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
            />

            <button
              type="button"
              onClick={() => setMostrarSenha((prev) => !prev)}
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-1.5 grid h-10 w-11 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              {mostrarSenha ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {!modoCadastro && (
            <div className="mt-3 mb-[18px] text-right">
              <button
                type="button"
                onClick={() =>
                  setMensagem({
                    tipo: "sucesso",
                    texto: "Recuperação de senha simulada (sem integração).",
                  })
                }
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                Esqueci a senha
              </button>
            </div>
          )}

          {mensagem && (
            <p
              role="status"
              className={`mb-4 rounded-xl px-3.5 py-2.5 text-sm font-medium ${
                mensagem.tipo === "erro"
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {mensagem.texto}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className={`${
              modoCadastro ? "mt-5" : ""
            } h-[52px] w-full cursor-pointer rounded-xl bg-blue-600 text-base font-bold text-white transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50`}
          >
            {carregando
              ? "AGUARDE..."
              : modoCadastro
              ? "CRIAR CONTA"
              : "ENTRAR"}
          </button>

          <p className="mt-[18px] text-center text-sm text-slate-500">
            {modoCadastro ? "Já tem conta? " : "Não tem conta? "}
            <button
              type="button"
              onClick={alternarModo}
              className="cursor-pointer font-bold text-violet-600 hover:underline"
            >
              {modoCadastro ? "Entrar" : "Criar conta"}
            </button>
          </p>
        </form>
      </section>
    </div>
  );
}
