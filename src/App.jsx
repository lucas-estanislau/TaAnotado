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

function AppLayout() {
  const location = useLocation()
  // Esconde a barra inferior apenas na tela de Login
  const showBottomNav = location.pathname !== '/login'

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