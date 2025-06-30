import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CadastrarClientes = () => {
  const [tipo, setTipo] = useState('Pessoa Física');
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    email: '',
    telefone: '',
    cpfCnpj: ''
  });

  const handleTipoChange = (e) => setTipo(e.target.value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clienteData = {
      nome: formData.nome,
      endereco: formData.endereco,
      e_mail: formData.email,
      telefone: formData.telefone.replace(/\D/g, ''),
      tipo_cliente: tipo,
      cpf: tipo === 'Pessoa Física' ? formData.cpfCnpj.replace(/\D/g, '') : null,
      cnpj: tipo === 'Pessoa Jurídica' ? formData.cpfCnpj.replace(/\D/g, '') : null
    };

    try {
      const response = await axios.post('http://localhost:8081/clientes', clienteData);
      console.log('Cliente cadastrado:', response.data);
      setFormData({
        nome: '',
        endereco: '',
        email: '',
        telefone: '',
        cpfCnpj: ''
      });
      alert('Cliente cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar:', error.response?.data || error.message);
      alert('Erro ao cadastrar cliente');
    }
  };

  const isPessoaJuridica = tipo === 'Pessoa Jurídica';
  const cpfPattern = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}";
  const cnpjPattern = "\\d{2}\\.\\d{3}\\.\\d{3}\\/\\d{4}-\\d{2}";
  const pattern = isPessoaJuridica ? cnpjPattern : cpfPattern;
  const placeholder = isPessoaJuridica ? "00.000.000/0000-00" : "000.000.000-00";
  const maxLength = isPessoaJuridica ? 18 : 14;

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0" style={{ textAlign: 'center' }}>{"Cadastrar Cliente 🛍️"}</h2>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label className="form-label">Nome (Obrigatório)</label>
              <input
                type="text"
                name="nome"
                className="form-control"
                placeholder="Ex: João da Silva"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Endereço (Obrigatório)</label>
              <input
                type="text"
                name="endereco"
                className="form-control"
                placeholder="Ex: Rua João da Silva, 214"
                value={formData.endereco}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Email (Obrigatório)</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="usuario@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <small className="form-text text-muted">
                Formato: usuario@email.com
              </small>
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Telefone (Obrigatório)</label>
              <input
                type="tel"
                name="telefone"
                className="form-control"
                placeholder="(00) 00000-0000"
                pattern="\(\d{2}\) \d{5}-\d{4}"
                value={formData.telefone}
                onChange={handleChange}
                required
              />
              <small className="form-text text-muted">
                Formato: (00) 00000-0000
              </small>
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Tipo</label>
              <select
                className="form-select"
                value={tipo}
                onChange={handleTipoChange}
              >
                <option value="Pessoa Física">Pessoa Física</option>
                <option value="Pessoa Jurídica">Pessoa Jurídica</option>
              </select>
            </div>

            <div className="form-group mb-4">
              <label className="form-label">CPF/CNPJ (Obrigatório)</label>
              <input
                type="text"
                name="cpfCnpj"
                className="form-control"
                placeholder={placeholder}
                pattern={pattern}
                maxLength={maxLength}
                value={formData.cpfCnpj}
                onChange={handleChange}
                title={
                  isPessoaJuridica
                    ? "Formato: 00.000.000/0000-00"
                    : "Formato: 000.000.000-00"
                }
                required
              />
              <small className="form-text text-muted">
                {isPessoaJuridica
                  ? "Formato CNPJ: 00.000.000/0000-00"
                  : "Formato CPF: 000.000.000-00"}
              </small>
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

export default CadastrarClientes;
