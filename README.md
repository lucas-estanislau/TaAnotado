# 📝 TaAnotado

Aplicativo web (PWA) desenvolvido para facilitar o controle de fiados e pagamentos de forma rápida, simples e organizada.

## Stack Tecnológica

- **Front-end:** React + Vite (JavaScript), Tailwind CSS e React Router.
- **Back-end e Banco de Dados:** Supabase (integração planejada: Authentication, PostgreSQL e Row Level Security).
- **PWA:** vite-plugin-pwa (suporte à instalação na tela inicial de dispositivos).

## Requisitos

- **Node.js:** versão 24 ou superior.
- **npm:** versão compatível com o Node.js instalado.

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd taanotado
```

### 2. Instale as dependências

```bash
npm ci
```

> **Nota:** Utilize `npm ci` para instalar as dependências exatamente de acordo com as versões registradas no `package-lock.json`.

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Após a inicialização, o Vite disponibilizará um endereço local no terminal, geralmente:

```text
http://localhost:5173
```

Acesse o endereço no navegador para visualizar a aplicação.

## Segurança

- Não inclua senhas, tokens, chaves privadas ou outras credenciais no código-fonte.
- Arquivos de ambiente (`.env`) devem ser mantidos fora do controle de versão.
- Quando o Supabase for configurado, as credenciais públicas necessárias deverão ser adicionadas por meio de variáveis de ambiente.
- A chave administrativa `service_role` do Supabase nunca deverá ser exposta no front-end.
- As políticas de Row Level Security (RLS) deverão ser configuradas antes de disponibilizar dados reais aos usuários.

## 🚧 Status do Projeto

O projeto está em desenvolvimento.

- [x] Estrutura inicial do front-end.
- [x] Configuração do ambiente React + Vite.
- [ ] Configuração do projeto Supabase.
- [ ] Integração com Supabase Authentication.
- [ ] Configuração do banco de dados PostgreSQL.
- [ ] Implementação das políticas de segurança RLS.
- [ ] Finalização e testes da aplicação PWA.