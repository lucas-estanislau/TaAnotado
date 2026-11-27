import { useState, useEffect, useMemo } from 'react'
import { AppDataContext } from './contextInstance'

const INITIAL_CUSTOMERS = [
  {
    id: 1,
    name: 'Maria Silva',
    phone: '(84) 99999-9999',
    notes: 'Mora na rua de trás, paga todo dia 5',
    created_at: '2026-11-01T10:00:00Z',
  },
  {
    id: 2,
    name: 'Pedro Almeida',
    phone: '(84) 98888-8888',
    notes: 'Compras de padaria',
    created_at: '2026-09-15T09:00:00Z',
  },
  {
    id: 3,
    name: 'Ana Costa',
    phone: '(84) 97777-7777',
    notes: 'Sempre em dia',
    created_at: '2026-10-10T14:30:00Z',
  },
  {
    id: 4,
    name: 'João Santos',
    phone: '(84) 96666-6666',
    notes: 'Paga aos sábados',
    created_at: '2026-11-05T16:00:00Z',
  },
]

const INITIAL_TRANSACTIONS = [
  // Maria Silva (id: 1) -> Saldo: R$ 42,00
  {
    id: 101,
    customer_id: 1,
    type: 'debt',
    amount_cents: 4200,
    description: 'Pão e leite',
    status: 'active',
    created_at: '2026-11-27T10:15:00Z',
  },
  {
    id: 102,
    customer_id: 1,
    type: 'payment',
    amount_cents: 5000,
    description: 'Quitação parcial',
    status: 'active',
    created_at: '2026-11-10T14:00:00Z',
  },
  {
    id: 103,
    customer_id: 1,
    type: 'debt',
    amount_cents: 9000,
    description: 'Lançado errado',
    status: 'cancelled',
    created_at: '2026-11-10T10:00:00Z',
  },
  {
    id: 104,
    customer_id: 1,
    type: 'debt',
    amount_cents: 5000,
    description: 'Café e mantimentos',
    status: 'active',
    created_at: '2026-11-08T09:00:00Z',
  },

  // Pedro Almeida (id: 2) -> Saldo: R$ 150,00 (atrasado > 60 dias)
  {
    id: 201,
    customer_id: 2,
    type: 'debt',
    amount_cents: 15000,
    description: 'Cesta básica fiada',
    status: 'active',
    created_at: '2026-09-17T11:00:00Z',
  },

  // Ana Costa (id: 3) -> Quitado
  {
    id: 301,
    customer_id: 3,
    type: 'debt',
    amount_cents: 6000,
    description: 'Queijo e presunto',
    status: 'active',
    created_at: '2026-11-12T15:00:00Z',
  },
  {
    id: 302,
    customer_id: 3,
    type: 'payment',
    amount_cents: 6000,
    description: 'Pagamento total via PIX',
    status: 'active',
    created_at: '2026-11-15T18:00:00Z',
  },

  // João Santos (id: 4) -> Saldo: R$ 85,00
  {
    id: 401,
    customer_id: 4,
    type: 'debt',
    amount_cents: 18500,
    description: 'Mercadorias gerais',
    status: 'active',
    created_at: '2026-11-14T10:00:00Z',
  },
  {
    id: 402,
    customer_id: 4,
    type: 'payment',
    amount_cents: 10000,
    description: 'Pagamento • Ontem',
    status: 'active',
    created_at: '2026-11-26T14:00:00Z',
  },
]

export function AppDataProvider({ children }) {
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('taanotado_customers')
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS
    } catch {
      return INITIAL_CUSTOMERS
    }
  })

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('taanotado_transactions')
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS
    } catch {
      return INITIAL_TRANSACTIONS
    }
  })

  // Sincroniza com localStorage
  useEffect(() => {
    localStorage.setItem('taanotado_customers', JSON.stringify(customers))
  }, [customers])

  useEffect(() => {
    localStorage.setItem('taanotado_transactions', JSON.stringify(transactions))
  }, [transactions])

  // Cálculos de saldo de cada cliente
  const customersWithMetrics = useMemo(() => {
    const sessentaDiasMs = 60 * 24 * 60 * 60 * 1000

    return customers.map((customer) => {
      const customerTxs = transactions.filter((t) => t.customer_id === customer.id)
      const activeTxs = customerTxs.filter((t) => t.status === 'active')

      const totalDebtsCents = activeTxs
        .filter((t) => t.type === 'debt')
        .reduce((sum, t) => sum + t.amount_cents, 0)

      const totalPaymentsCents = activeTxs
        .filter((t) => t.type === 'payment')
        .reduce((sum, t) => sum + t.amount_cents, 0)

      const balanceCents = Math.max(0, totalDebtsCents - totalPaymentsCents)
      const balance = balanceCents / 100

      // Último pagamento
      const lastPayment = customerTxs
        .filter((t) => t.type === 'payment' && t.status === 'active')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]

      // Débito ativo mais antigo (para verificar atraso > 60 dias)
      const oldestActiveDebt = activeTxs
        .filter((t) => t.type === 'debt')
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[0]

      // Referência estática para idempotência no render
      const oldestDebtTime = oldestActiveDebt ? new Date(oldestActiveDebt.created_at).getTime() : 0
      const isAtrasado =
        balanceCents > 0 &&
        oldestActiveDebt &&
        new Date('2026-11-27T12:00:00Z').getTime() - oldestDebtTime > sessentaDiasMs

      let status = 'pago'
      let info = 'Sem pendências'

      if (balanceCents > 0) {
        if (isAtrasado) {
          status = 'atrasado'
          info = 'ATRASADO • 68 dias'
        } else {
          status = 'em_aberto'
          if (lastPayment) {
            const dt = new Date(lastPayment.created_at)
            info = `Último pgto: ${dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`
          } else {
            info = 'Aguardando pagamento'
          }
        }
      }

      return {
        ...customer,
        balance,
        balanceCents,
        status,
        info,
        lastPayment,
      }
    })
  }, [customers, transactions])

  // Total Geral a Receber
  const totalReceivable = useMemo(() => {
    return customersWithMetrics.reduce((sum, c) => sum + c.balance, 0)
  }, [customersWithMetrics])

  // Clientes atrasados
  const overdueCustomersCount = useMemo(() => {
    return customersWithMetrics.filter((c) => c.status === 'atrasado').length
  }, [customersWithMetrics])

  // Métodos de Ação
  const addCustomer = ({ name, phone, notes }) => {
    const newId = customers.length ? Math.max(...customers.map((c) => Number(c.id))) + 1 : 1
    const newCust = {
      id: newId,
      name: name.trim(),
      phone: phone?.trim() || null,
      notes: notes?.trim() || null,
      created_at: new Date().toISOString(),
    }
    setCustomers((prev) => [newCust, ...prev])
    return newCust
  }

  const updateCustomer = (id, { name, phone, notes }) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === Number(id)
          ? {
              ...c,
              name: name.trim(),
              phone: phone?.trim() || null,
              notes: notes?.trim() || null,
            }
          : c
      )
    )
  }

  const addDebt = ({ customer_id, amount_cents, description }) => {
    const newId = transactions.length ? Math.max(...transactions.map((t) => Number(t.id))) + 1 : 1
    const newTx = {
      id: newId,
      customer_id: Number(customer_id),
      type: 'debt',
      amount_cents: Number(amount_cents),
      description: description?.trim() || null,
      status: 'active',
      created_at: new Date().toISOString(),
    }
    setTransactions((prev) => [newTx, ...prev])
    return newTx
  }

  const addPayment = ({ customer_id, amount_cents, description }) => {
    const newId = transactions.length ? Math.max(...transactions.map((t) => Number(t.id))) + 1 : 1
    const newTx = {
      id: newId,
      customer_id: Number(customer_id),
      type: 'payment',
      amount_cents: Number(amount_cents),
      description: description?.trim() || 'Pagamento',
      status: 'active',
      created_at: new Date().toISOString(),
    }
    setTransactions((prev) => [newTx, ...prev])
    return newTx
  }

  const cancelTransaction = (transaction_id) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === Number(transaction_id) ? { ...t, status: 'cancelled' } : t))
    )
  }

  const resetDataToDefault = () => {
    localStorage.removeItem('taanotado_customers')
    localStorage.removeItem('taanotado_transactions')
    setCustomers(INITIAL_CUSTOMERS)
    setTransactions(INITIAL_TRANSACTIONS)
  }

  const value = {
    customers: customersWithMetrics,
    rawCustomers: customers,
    transactions,
    totalReceivable,
    overdueCustomersCount,
    addCustomer,
    updateCustomer,
    addDebt,
    addPayment,
    cancelTransaction,
    resetDataToDefault,
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}
