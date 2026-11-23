import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginCadastro } from "./pages/LoginCadastro/LoginCadastro";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/logincadastro" element={<LoginCadastro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;