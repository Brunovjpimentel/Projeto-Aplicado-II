import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ListarContrato = () => {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  const buscarContratos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8081/listarcontratos', {
        params: { search: searchTerm }
      });
      setContratos(response.data);
    } catch (error) {
      console.error('Erro ao buscar contratos:', error);
      setContratos([]);
    } finally {
      setLoading(false);
    }
  };

  const deletarContrato = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este contrato?')) {
      try {
        await axios.delete(`http://localhost:8081/listarcontratos/${id}`);
        alert('Contrato excluído com sucesso!');
        buscarContratos();
      } catch (error) {
        console.error('Erro ao excluir contrato:', error);
        alert('Erro ao excluir contrato. Tente novamente.');
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    buscarContratos();
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedContratos = useMemo(() => {
    const sortableItems = [...contratos];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'id') {
          return sortConfig.direction === 'ascending' ? a.id - b.id : b.id - a.id;
        }

        if (sortConfig.key === 'valor') {
          const valA = parseFloat(a.valor.toString().replace('R$ ', '').replace(',', '.'));
          const valB = parseFloat(b.valor.toString().replace('R$ ', '').replace(',', '.'));
          return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
        }

        if (sortConfig.key.includes('data')) {
          const dateA = new Date(a[sortConfig.key]);
          const dateB = new Date(b[sortConfig.key]);
          return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
        }

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [contratos, sortConfig]);

  useEffect(() => {
    buscarContratos();
  }, []);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

return (
  <div className="container mt-4">
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h2 className="mb-0 text-center">Lista de Contratos</h2>
      </div>

      <div className="card-body">
        <div className="mb-4">
          <h4>Buscar Contratos</h4>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por ID do contrato, cliente ou equipamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={handleSearch}
            >
              Buscar
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Total de contratos: {contratos.length}</h5>
            </div>

            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>
                      ID {getSortIcon('id')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('cliente')}>
                      Cliente {getSortIcon('cliente')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('equipamento')}>
                      Equipamento {getSortIcon('equipamento')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('dataInicio')}>
                      Data Início {getSortIcon('dataInicio')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('dataFim')}>
                      Data Fim {getSortIcon('dataFim')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('valor')}>
                      Valor {getSortIcon('valor')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>
                      Status {getSortIcon('status')}
                    </th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedContratos.length > 0 ? (
                    sortedContratos.map((contrato) => (
                      <React.Fragment key={contrato.id}>
                        <tr>
                          <td>{contrato.id}</td>
                          <td>{contrato.cliente}</td>
                          <td>{contrato.equipamento}</td>
                          <td>{new Date(contrato.dataInicio).toLocaleDateString('pt-BR')}</td>
                          <td>{new Date(contrato.dataFim).toLocaleDateString('pt-BR')}</td>
                          <td>R$ {contrato.valor}</td>
                          <td>
                            <span className={`badge ${contrato.status === 'Ativo' ? 'bg-success' : 'bg-secondary'}`}>
                              {contrato.status}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Link
                                to={`/editarcontrato/${contrato.id}`}
                                className="btn btn-primary btn-sm"
                                title="Editar"
                              >
                                Editar
                              </Link>
                              <button
                                className="btn btn-danger btn-sm"
                                title="Excluir"
                                onClick={() => deletarContrato(contrato.id)}
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                        {contrato.observacoes && (
                          <tr className="bg-light">
                            <td colSpan="8">
                              <div className="d-flex align-items-center p-2">
                                <strong className="me-2">Observações:</strong>
                                <span>{contrato.observacoes}</span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        Nenhum contrato encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);
};
export default ListarContrato;