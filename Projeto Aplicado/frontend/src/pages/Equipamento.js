import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CadastrarEquipamento = () => {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    numero_serie: '',
    tipo: '',
    observacoes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const equipamentoData = {
      marca: formData.marca,
      modelo: formData.modelo,
      numero_serie: formData.numero_serie,
      tipo: formData.tipo,
      observacoes: formData.observacoes
    };

    try {
      const response = await axios.post('http://localhost:8081/equipamento', equipamentoData);
      console.log('Equipamento cadastrado:', response.data);
      setFormData({
        marca: '',
        modelo: '',
        numero_serie: '',
        tipo: '',
        observacoes: ''
      });
      alert('Equipamento cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar:', error.response?.data || error.message);
      alert('Erro ao cadastrar equipamento');
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0 text-center">Cadastrar Equipamento 💻</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label className="form-label">Marca (Obrigatório)</label>
              <input
                type="text"
                name="marca"
                className="form-control"
                placeholder="Ex: Lenovo, Positivo, Dell, etc."
                value={formData.marca}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Modelo (Obrigatório)</label>
              <input
                type="text"
                name="modelo"
                className="form-control"
                value={formData.modelo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Número Série (Obrigatório)</label>
              <input
                type="text"
                name="numero_serie"
                className="form-control"
                value={formData.numero_serie}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Tipo (Obrigatório)</label>
              <input
                type="text"
                name="tipo"
                className="form-control"
                placeholder="Computador, Monitor, etc."
                value={formData.tipo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Observações</label>
              <textarea
                name="observacoes"
                className="form-control"
                placeholder="Informações adicionais sobre o equipamento"
                value={formData.observacoes}
                onChange={handleChange}
                maxLength={255}
                rows={3}
              />
              <small className="text-muted">Máximo de 255 caracteres</small>
            </div>

            <div className="d-flex justify-content-between">
              <div>
                <Link to="/ListarContrato" className="btn btn-outline-primary me-2">
                  Histórico de Locações
                </Link>
                <Link to="/ListarContrato" className="btn btn-outline-primary">
                  Gerenciar Contratos
                </Link>
              </div>
              <button type="submit" className="btn btn-primary">
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastrarEquipamento;
