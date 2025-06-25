import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ListarContrato = () => {
    const [contratos, setContratos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dados de exemplo - posteriormente será substituído pela busca real da API
    useEffect(() => {
        // Função para buscar contratos da API
        const buscarContratos = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8081/listarcontratos');
                setContratos(response.data);
            } catch (error) {
                console.error('Erro ao buscar contratos:', error);
                setContratos([]);
            } finally {
                setLoading(false);
            }
        };

        buscarContratos();
    }, []);

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h2 className="mb-0" style={{ textAlign: 'center' }}>Lista de Contratos</h2>
                </div>

                <div className="card-body">
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
                                            <th scope="col">ID</th>
                                            <th scope="col">Cliente</th>
                                            <th scope="col">Equipamento</th>
                                            <th scope="col">Data Início</th>
                                            <th scope="col">Data Fim</th>
                                            <th scope="col">Valor</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contratos.length > 0 ? (
                                            contratos.map((contrato) => (
                                                <tr key={contrato.id}>
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
                                                            <button 
                                                                className="btn btn-primary btn-sm"
                                                                title="Editar"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button 
                                                                className="btn btn-danger btn-sm"
                                                                title="Excluir"
                                                            >
                                                                Excluir
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
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

}

export default ListarContrato;