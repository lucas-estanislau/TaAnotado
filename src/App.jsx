import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'

import Login from './pages/Login'
import Home from './pages/Home'
import NewDebt from './pages/NewDebt'
import ReceivePayment from './pages/ReceivePayment'
import Customers from './pages/Customers'
import CustomerForm from './pages/CustomerForm'
import CustomerDetail from './pages/CustomerDetail'
import Metrics from './pages/Metrics'
import NotFound from './pages/NotFound'
import BottomNav from './components/BottomNav'
import ProtectedRoute from './components/ProtectedRoute'

const ROUTES_WITH_BOTTOM_NAV = [
  '/home',
  '/new-debt',
  '/receive-payment',
  '/customers',
  '/customers/new',
  '/customers/edit',
  '/customers/detail',
  '/metrics',
]

function AppLayout() {
  const location = useLocation()
  // Exibe a barra inferior apenas nas telas internas válidas (oculta no Login e no 404)
  const showBottomNav = ROUTES_WITH_BOTTOM_NAV.includes(location.pathname)

  return (
    <div className="min-h-screen bg-slate-200 flex justify-center">
      {/* pb-[92px] evita que o conteúdo final da tela fique escondido atrás do menu fixo */}
      <div className={`w-full max-w-[448px] min-h-screen bg-slate-50 shadow-lg relative ${showBottomNav ? 'pb-[92px]' : ''}`}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/new-debt" element={<NewDebt />} />
            <Route path="/receive-payment" element={<ReceivePayment />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/new" element={<CustomerForm />} />
            <Route path="/customers/edit" element={<CustomerForm />} />
            <Route path="/customers/detail" element={<CustomerDetail />} />
            <Route path="/metrics" element={<Metrics />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>

        {showBottomNav && <BottomNav />}
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App