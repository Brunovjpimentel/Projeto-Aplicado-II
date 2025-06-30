import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CadastrarContrato = () => {
  const [formData, setFormData] = useState({
    cliente: '',
    equipamento_id: '',
    data_locacao: '',
    data_devolucao: '',
    valor: ''
  });

  const [equipamentos, setEquipamentos] = useState([]);
  const [numeroContrato, setNumeroContrato] = useState(null);
  const [errors, setErrors] = useState({});
  const [clientes, setClientes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8081/equipamento')
      .then(res => setEquipamentos(res.data))
      .catch(err => console.error('Erro ao buscar equipamentos:', err));

    axios.get('http://localhost:8081/clientes')
      .then(res => setClientes(res.data))
      .catch(err => console.error('Erro ao buscar clientes:', err));
  }, []);

  const handleClientSearch = (e) => {
    const term = e.target.value;
    setFormData(prev => ({ ...prev, cliente: term }));

    if (term.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const filtered = clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(term.toLowerCase()) ||
      (cliente.cpf && cliente.cpf.includes(term)) ||
      (cliente.cnpj && cliente.cnpj.includes(term))
    );
    setSearchResults(filtered);
    setIsSearching(false);
  };

  const selectClient = (cliente) => {
    setFormData(prev => ({ ...prev, cliente: cliente.cpf || cliente.cnpj }));
    setSearchResults([]);
  };

  const gerarNumeroContrato = () => 'CTR-' + Date.now();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validarCampos = () => {
    const newErrors = {};

    if (!formData.cliente.trim()) newErrors.cliente = 'CPF ou CNPJ é obrigatório.';
    if (!formData.equipamento_id) newErrors.equipamento_id = 'Selecione um equipamento.';
    if (!formData.data_locacao) newErrors.data_locacao = 'Data de locação é obrigatória.';
    if (!formData.data_devolucao) newErrors.data_devolucao = 'Data de devolução é obrigatória.';
    if (!formData.valor || parseFloat(formData.valor) <= 0) newErrors.valor = 'Valor deve ser maior que zero.';

    if (formData.data_locacao && formData.data_devolucao) {
      const locacao = new Date(formData.data_locacao);
      const devolucao = new Date(formData.data_devolucao);
      if (devolucao < locacao) newErrors.data_devolucao = 'A data de devolução não pode ser anterior à data de locação.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCampos()) return;

    try {
      const clientResponse = await axios.get('http://localhost:8081/clientes/find', {
        params: { q: formData.cliente }
      });

      if (!clientResponse.data) {
        alert('Cliente não encontrado! Por favor, selecione um cliente válido da lista.');
        return;
      }

      const clientId = clientResponse.data.id;

      const dadosContrato = {
        cliente_id: clientId,
        equipamento_id: parseInt(formData.equipamento_id),
        data_locacao: formData.data_locacao,
        data_devolucao: formData.data_devolucao,
        valor: parseFloat(formData.valor)
      };

      const response = await axios.post('http://localhost:8081/contrato', dadosContrato);
      console.log('Contrato cadastrado:', response.data);
      alert(`Contrato cadastrado com sucesso! ID: ${response.data.id}`);

      setFormData({
        cliente: '',
        equipamento_id: '',
        data_locacao: '',
        data_devolucao: '',
        valor: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Erro ao cadastrar contrato:', error.response?.data || error.message);
      alert('Erro ao cadastrar contrato: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0 text-center">Cadastrar Contrato de Locação 📝</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label className="form-label">Buscar Cliente (Nome, CPF/CNPJ)</label>
              <input
                type="text"
                name="cliente"
                className="form-control"
                value={formData.cliente}
                onChange={handleClientSearch}
                placeholder="Digite nome, CPF ou CNPJ"
              />
              {errors.cliente && <small className="text-danger">{errors.cliente}</small>}
              {searchResults.length > 0 && (
                <div className="mt-2 border rounded bg-white" style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                  position: 'absolute',
                  zIndex: 1000,
                  width: '100%'
                }}>
                  {searchResults.map(cliente => (
                    <div
                      key={cliente.id}
                      className="p-2 border-bottom hover-bg"
                      style={{ cursor: 'pointer' }}
                      onClick={() => selectClient(cliente)}
                    >
                      <div><strong>{cliente.nome}</strong></div>
                      <div>{cliente.cpf || cliente.cnpj}</div>
                    </div>
                  ))}
                </div>
              )}
              {isSearching && <div className="mt-2 text-muted">Buscando...</div>}
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Equipamento</label>
              <select
                name="equipamento_id"
                className="form-control"
                value={formData.equipamento_id}
                onChange={handleChange}
              >
                <option value="">Selecione um equipamento</option>
                {equipamentos.map(equip => (
                  <option key={equip.id} value={equip.id}>
                    {equip.marca} - {equip.modelo} ({equip.numero_serie})
                  </option>
                ))}
              </select>
              {errors.equipamento_id && <small className="text-danger">{errors.equipamento_id}</small>}
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Data da Locação</label>
              <input
                type="date"
                name="data_locacao"
                className="form-control"
                value={formData.data_locacao}
                onChange={handleChange}
                pattern="\d{4}-\d{2}-\d{2}"
                onInput={(e) => {
                  if (e.target.value.length > 10) {
                    e.target.value = e.target.value.slice(0, 10);
                  }
                }}
              />
              {errors.data_locacao && <small className="text-danger">{errors.data_locacao}</small>}
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Data de Devolução</label>
              <input
                type="date"
                name="data_devolucao"
                className="form-control"
                value={formData.data_devolucao}
                onChange={handleChange}
                pattern="\d{4}-\d{2}-\d{2}"
                onInput={(e) => {
                  if (e.target.value.length > 10) {
                    e.target.value = e.target.value.slice(0, 10);
                  }
                }}
              />
              {errors.data_devolucao && <small className="text-danger">{errors.data_devolucao}</small>}
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Valor (R$)</label>
              <input
                type="number"
                name="valor"
                className="form-control"
                step="0.01"
                value={formData.valor}
                onChange={handleChange}
              />
              {errors.valor && <small className="text-danger">{errors.valor}</small>}
            </div>

            <div className="d-flex justify-content-between">
              <div>
                <Link to="/Equipamentos" className="btn btn-outline-primary me-2">
                  Cadastrar Novo Equipamento
                </Link>
                <Link to="/ListarContrato" className="btn btn-outline-primary">
                  Histórico de Locações
                </Link>
              </div>
              <button type="submit" className="btn btn-primary">Cadastrar Contrato</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastrarContrato;