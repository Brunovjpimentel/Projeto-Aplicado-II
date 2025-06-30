import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Cliente from './pages/Cliente'
import Equipamento from './pages/Equipamento'
import Contrato from './pages/Contrato'
import ListarContrato from './pages/ListarContrato'
import EditarContrato  from './pages/EditarContrato';
import Nav from 'react-bootstrap/Nav';


function App() {
  return (
    <div className="app">
      <h1 align="center">🖥️ LocaTech Informática 🖥️</h1>
      <BrowserRouter>
        <Nav fill variant="tabs" defaultActiveKey="/">
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
            <Nav.Link as={Link} to="/ListarContrato">Listar Contratos</Nav.Link>
          </Nav.Item>
        </Nav>
        <Routes>
<Route path='/clientes' element={<Cliente />} />
<Route path='/equipamentos' element={<Equipamento />} />
<Route path='/contratos' element={<Contrato />} />
<Route path='/listarcontrato' element={<ListarContrato />} />
<Route path='/editarcontrato/:id' element={<EditarContrato />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
