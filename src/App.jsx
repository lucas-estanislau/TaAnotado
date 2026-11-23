import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginCadastro } from "./pages/LoginCadastro/LoginCadastro";
import CustomerForm from "./pages/CustomerForm";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/logincadastro" element={<LoginCadastro />} />
        <Route path="/customers/new" element={<CustomerForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;