import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';

const EditarContrato = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedContract, setSelectedContract] = useState(null);
  const [formData, setFormData] = useState({
    cliente: '',
    equipamento_id: '',
    data_locacao: '',
    data_devolucao: '',
    valor: '',
    observacoes: ''
  });
  const [equipamentos, setEquipamentos] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const equipResponse = await axios.get('http://localhost:8081/equipamento');
        setEquipamentos(equipResponse.data);

        if (id) {
          const contractResponse = await axios.get(`http://localhost:8081/contrato/${id}`);
          const contractData = contractResponse.data;

          setSelectedContract({
            id: id,
            cliente: contractData.cliente,
            equipamento: contractData.equipamento
          });

          setFormData({
            cliente: contractData.cliente || '',
            equipamento_id: contractData.FK_EQUIPAMENTO_id,
            data_locacao: contractData.data_locacao.split('T')[0],
            data_devolucao: contractData.data_devolucao.split('T')[0],
            valor: contractData.valor,
            observacoes: contractData.observacoes || ''
          });
        }
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        alert('Erro ao carregar dados do contrato');
        navigate('/ListarContrato');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

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

    try {
      await axios.put(`http://localhost:8081/contrato/${id}`, formData);
      alert(`Contrato ${id} atualizado com sucesso!`);
      navigate('/ListarContrato');
    } catch (error) {
      console.error('Erro ao atualizar contrato:', error.response?.data || error.message);
      alert('Erro ao atualizar contrato. Verifique os dados e tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0 text-center">Editar Contrato de Locação</h2>
        </div>

        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Editando Contrato: {id}</h4>
            <Link to="/ListarContrato" className="btn btn-outline-secondary">
              Voltar para lista
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
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

            <div className="form-group mb-3">
              <label className="form-label">Observações do Equipamento</label>
              <textarea
                name="observacoes"
                className="form-control"
                placeholder="Informações adicionais sobre o equipamento"
                value={formData.observacoes}
                onChange={handleChange}
                maxLength={255}
                rows={3}
              />
            </div>

            <div className="d-flex justify-content-between mt-4">
              <div>
                <Link to="/Equipamentos" className="btn btn-outline-primary me-2">
                  Cadastrar Novo Equipamento
                </Link>
                <Link to="/ListarContrato" className="btn btn-outline-primary">
                  Histórico de Locações
                </Link>
              </div>
              <button type="submit" className="btn btn-primary">Atualizar Contrato</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarContrato;
