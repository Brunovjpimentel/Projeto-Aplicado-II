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

app.get("/", (req, res) => {
    const sql = "SELECT * FROM CLIENTE";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Erro de solicitação: ", err);
            return res.status(500).json({ error: "Erro do banco de dados." });
        }
        return res.json(data);
    });
});

app.listen(8081, () => {
    console.log("A porta 8081 está funcionando.");
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