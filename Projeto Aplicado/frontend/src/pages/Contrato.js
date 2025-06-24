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

  useEffect(() => {
    axios.get('http://localhost:8081/equipamento')
      .then(res => setEquipamentos(res.data))
      .catch(err => console.error('Erro ao buscar equipamentos:', err));
  }, []);

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
      if (devolucao < locacao) {
        newErrors.data_devolucao = 'A data de devolução não pode ser anterior à data de locação.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCampos()) return;

    const numero = gerarNumeroContrato();
    const dadosContrato = {
      ...formData,
      numero_contrato: numero
    };

    try {
      const response = await axios.post('http://localhost:8081/contrato', dadosContrato);
      console.log('Contrato cadastrado:', response.data);
      alert(`Contrato ${numero} cadastrado com sucesso!`);
      setNumeroContrato(numero);
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
      alert('Erro ao cadastrar contrato');
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0 text-center">Cadastrar Contrato de Locação</h2>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <p className="fw-bold">Contrato Nº: <span className="text-secondary">{numeroContrato || '(auto-gerado)'}</span></p>
            <p className="text-muted">Conectado como: <strong>Administrador</strong></p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Cliente */}
            <div className="form-group mb-3">
              <label className="form-label">Cliente (CPF/CNPJ)</label>
              <input
                type="text"
                name="cliente"
                className="form-control"
                value={formData.cliente}
                onChange={handleChange}
              />
              {errors.cliente && <small className="text-danger">{errors.cliente}</small>}
            </div>

            {/* Equipamento */}
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

            {/* Data Locação */}
            <div className="form-group mb-3">
              <label className="form-label">Data da Locação</label>
              <input
                type="date"
                name="data_locacao"
                className="form-control"
                value={formData.data_locacao}
                onChange={handleChange}
              />
              {errors.data_locacao && <small className="text-danger">{errors.data_locacao}</small>}
            </div>

            {/* Data Devolução */}
            <div className="form-group mb-3">
              <label className="form-label">Data de Devolução</label>
              <input
                type="date"
                name="data_devolucao"
                className="form-control"
                value={formData.data_devolucao}
                onChange={handleChange}
              />
              {errors.data_devolucao && <small className="text-danger">{errors.data_devolucao}</small>}
            </div>

            {/* Valor */}
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
                <Link to="/historico" className="btn btn-outline-primary">
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