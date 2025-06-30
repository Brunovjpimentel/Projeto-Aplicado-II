const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "LocaTech"
});

db.connect(err => {
    if (err) {
        console.error("Erro de conexão ao banco de dados:", err);
        process.exit(1);
    }
    console.log("Conectado ao banco de dados com sucesso.");
});

// Existing endpoints
app.get("/clientes", (req, res) => {
    const sql = "SELECT * FROM CLIENTE";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Erro de solicitação: ", err);
            return res.status(500).json({ error: "Erro do banco de dados." });
        }
        return res.json(data);
    });
});

app.post("/clientes", (req, res) => {
  const { nome, endereco, e_mail, telefone, tipo_cliente, cpf, cnpj } = req.body;
  
  if (!nome || !endereco || !e_mail || !telefone || !tipo_cliente) {
    return res.status(400).json({ error: "Faltou preencher dados." });
  }

  const sql = `
    INSERT INTO CLIENTE 
    (nome, endereco, e_mail, telefone, tipo_cliente, cpf, cnpj) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [nome, endereco, e_mail, telefone, tipo_cliente, cpf, cnpj];
  
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Falha ao inserir no banco de dados." });
    }
    return res.status(201).json({
      id: result.insertId,
      message: "Cliente cadastrado com sucesso"
    });
  });
});

app.get("/equipamento", (req, res) => {
    const sql = "SELECT * FROM EQUIPAMENTO";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Erro de solicitação: ", err);
            return res.status(500).json({ error: "Erro do banco de dados." });
        }
        return res.json(data);
    });
});

app.post("/equipamento", (req, res) => {
  const { marca, modelo, numero_serie, tipo, observacoes } = req.body;
  
  if (!marca || !modelo || !numero_serie || !tipo) {
    return res.status(400).json({ error: "Faltou preencher dados." });
  }

  const sql = `
    INSERT INTO EQUIPAMENTO 
    (marca, modelo, numero_serie, tipo, observacoes) 
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [marca, modelo, numero_serie, tipo, observacoes || null];
  
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Falha ao inserir no banco de dados." });
    }
    return res.status(201).json({
      id: result.insertId,
      message: "Equipamento cadastrado com sucesso"
    });
  });
});
    app.get("/clientes/search", (req, res) => {
        const searchTerm = req.query.q || ''; 
  const sql = `
        SELECT * FROM CLIENTE 
        WHERE 
            nome LIKE ? OR 
            cpf LIKE ? OR 
            cnpj LIKE ? OR
            CONCAT(cpf, cnpj) LIKE ?
    `;
  
  const searchParam = `%${searchTerm}%`;
  db.query(sql, [searchParam, searchParam, searchParam], (err, data) => {
    if (err) {
      console.error("Erro de solicitação: ", err);
      return res.status(500).json({ error: "Erro do banco de dados." });
    }
    return res.json(data);
  });
});

// Create contract endpoint
app.post("/contrato", (req, res) => {
  const { cliente_id, equipamento_id, data_locacao, data_devolucao, valor } = req.body;
  
  if (!cliente_id || !equipamento_id || !data_locacao || !data_devolucao || !valor) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const sql = `
    INSERT INTO LOCACAO 
    (FK_CLIENTE_id, FK_EQUIPAMENTO_id, data_locacao, data_devolucao, valor, status)
    VALUES (?, ?, ?, ?, ?, 'Ativo')
  `;
  
  const values = [cliente_id, equipamento_id, data_locacao, data_devolucao, valor];
  
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro ao criar contrato:", err);
      return res.status(500).json({ error: "Falha ao criar contrato." });
    }
    return res.json({ 
      id: result.insertId,
      message: "Contrato criado com sucesso" 
    });
  });
});

// Enhanced search endpoint with query support
app.get("/listarcontratos", (req, res) => {
    const searchTerm = req.query.search || '';
    const searchParam = `%${searchTerm}%`;
    
const sql = `
    SELECT 
        l.id,
        c.nome as cliente,
        CONCAT(e.marca, ' ', e.modelo) as equipamento,
        e.observacoes,
        DATE_FORMAT(l.data_locacao, '%Y-%m-%d') as dataInicio,
        DATE_FORMAT(l.data_devolucao, '%Y-%m-%d') as dataFim,
        FORMAT(l.valor, 2) as valor,
        l.status
    FROM LOCACAO l
    JOIN CLIENTE c ON l.FK_CLIENTE_id = c.id  
    JOIN EQUIPAMENTO e ON l.FK_EQUIPAMENTO_id = e.id
    WHERE 
        l.id LIKE ? OR 
        c.nome LIKE ? OR 
        e.marca LIKE ? OR 
        e.modelo LIKE ? OR 
        e.numero_serie LIKE ?
    ORDER BY l.id DESC
`;
    
    const params = [
        searchParam, 
        searchParam,
        searchParam,
        searchParam,
        searchParam
    ];
    
    db.query(sql, params, (err, data) => {
        if (err) {
            console.error("Erro de solicitação: ", err);
            return res.status(500).json({ error: "Erro do banco de dados." });
        }
        return res.json(data);
    });
});

app.delete("/listarcontratos/:id", (req, res) => {
    const contratoId = req.params.id;
    const sql = "DELETE FROM LOCACAO WHERE id = ?";
    
    db.query(sql, [contratoId], (err, result) => {
        if (err) {
            console.error("Erro ao deletar contrato:", err);
            return res.status(500).json({ error: "Erro do banco de dados." });
        }
        return res.json({ message: "Contrato deletado com sucesso." });
    });
});

// New endpoints for contract editing
app.get("/contrato/:id", (req, res) => {
    const contractId = req.params.id;
    const sql = `
        SELECT 
            l.*,
            COALESCE(c.cpf, c.cnpj) as cliente_identificador,
            e.observacoes
        FROM LOCACAO l
        JOIN CLIENTE c ON l.FK_CLIENTE_id = c.id
        JOIN EQUIPAMENTO e ON l.FK_EQUIPAMENTO_id = e.id 
        WHERE l.id = ?
    `;
    
    db.query(sql, [contractId], (err, data) => {
        if (err) {
            console.error("Erro ao buscar contrato:", err);
            return res.status(500).json({ error: "Erro do banco de dados." });
        }
        if (data.length === 0) {
            return res.status(404).json({ error: "Contrato não encontrado." });
        }
        
        const contract = data[0];
        return res.json({
            ...contract,
            cliente: contract.cliente_identificador,
            observacoes: contract.observacoes  // Include observations in response
        });
    });
});
app.get("/clientes/find", (req, res) => {
  const identifier = req.query.q || '';
  const sql = `
    SELECT * FROM CLIENTE 
    WHERE cpf = ? OR cnpj = ?
  `;
  
  db.query(sql, [identifier, identifier], (err, data) => {
    if (err) {
      console.error("Erro de solicitação: ", err);
      return res.status(500).json({ error: "Erro do banco de dados." });
    }
    return res.json(data.length > 0 ? data[0] : null);
  });
});

app.put("/contrato/:id", (req, res) => {
  const contractId = req.params.id;
  const { cliente, equipamento_id, data_locacao, data_devolucao, valor, observacoes } = req.body;

  // Step 1: Find client by CPF/CNPJ
  const findClientSql = "SELECT id FROM CLIENTE WHERE cpf = ? OR cnpj = ?";
  db.query(findClientSql, [cliente, cliente], (err, clientData) => {
    if (err) {
      console.error("Erro ao buscar cliente:", err);
      return res.status(500).json({ error: "Erro do banco de dados." });
    }
    if (clientData.length === 0) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }

    const clientId = clientData[0].id;
    
    // Step 2: Update equipment observations
    const updateEquipmentSql = `
      UPDATE EQUIPAMENTO SET observacoes = ?
      WHERE id = ?
    `;
    
    db.query(updateEquipmentSql, [observacoes || null, equipamento_id], (equipErr) => {
      if (equipErr) {
        console.error("Erro ao atualizar observações do equipamento:", equipErr);
        return res.status(500).json({ error: "Falha ao atualizar observações." });
      }
      
      // Step 3: Update contract
      const updateContractSql = `
        UPDATE LOCACAO SET
          FK_CLIENTE_id = ?,
          FK_EQUIPAMENTO_id = ?,
          data_locacao = ?,
          data_devolucao = ?,
          valor = ?
        WHERE id = ?
      `;
      
      const values = [
        clientId,
        equipamento_id,
        data_locacao,
        data_devolucao,
        valor,
        contractId
      ];

      db.query(updateContractSql, values, (err, result) => {
        if (err) {
          console.error("Erro ao atualizar contrato:", err);
          return res.status(500).json({ error: "Falha ao atualizar contrato." });
        }
        return res.json({ message: "Contrato e observações atualizados com sucesso." });
      });
    });
  });
});

app.listen(8081, () => {
    console.log("Servidor rodando na porta 8081");
});