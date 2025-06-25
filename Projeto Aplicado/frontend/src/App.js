import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Cliente from './pages/Cliente'
import Equipamento from './pages/Equipamento'
import Contrato from './pages/Contrato'
import ListarContrato from './pages/ListarContrato'
import Nav from 'react-bootstrap/Nav';

function App() {
  return (
    <div className="app">
      <h1>Projeto Aplicado II</h1>
      <BrowserRouter>
        <Nav fill variant="tabs" defaultActiveKey="/">
          <Nav.Item>
            <Nav.Link as={Link} to="/">Página Inicial</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/Equipamentos">Cadastrar Equipamentos</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/Clientes">Cadastrar Clientes</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/Contratos">Cadastrar Contratos</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/ListarContratos">Listar Contratos</Nav.Link>
          </Nav.Item>
        </Nav>
        <Routes>
          <Route path='/Clientes' element={<Cliente />} />
          <Route path='/Equipamentos' element={<Equipamento />} />
          <Route path='/Contratos' element={<Contrato />} />
          <Route path='/ListarContratos' element={<ListarContrato />} />
          <Route path='/' element={<div>Página Inicial</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
