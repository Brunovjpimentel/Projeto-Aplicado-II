drop database LocaTech;
Create database LocaTech;
USE LocaTech;

CREATE TABLE CLIENTE (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(50),
  endereco VARCHAR(50),
  e_mail VARCHAR(50),
  telefone CHAR(11),
  cpf CHAR(11),
  cnpj CHAR(14),
  tipo_cliente VARCHAR(20)
);

CREATE TABLE FUNCIONARIO (
    id INT PRIMARY KEY,
    nome VARCHAR (50)
);

CREATE TABLE EQUIPAMENTO (
    tipo VARCHAR (20),
    modelo VARCHAR (20),
    numero_serie INT,
    id INT PRIMARY KEY,
    marca VARCHAR (30)
);


CREATE TABLE MANUTENCAO (
    id INT PRIMARY KEY,
    data TIMESTAMP,
    defeito VARCHAR (100),
    FK_EQUIPAMENTO_id INT
);

CREATE TABLE LOCACAO (
    status VARCHAR (20),
    data_locacao TIMESTAMP,
    data_devolucao TIMESTAMP,
    id INT PRIMARY KEY,
    valor DECIMAL,
    FK_FUNCIONARIO_id INT,
    FK_CLIENTE_id INT,
    FK_EQUIPAMENTO_id INT
);
 
ALTER TABLE LOCACAO ADD CONSTRAINT FK_FUNCIONARIO_id
    FOREIGN KEY (FK_FUNCIONARIO_id)
    REFERENCES FUNCIONARIO (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
 
ALTER TABLE LOCACAO ADD CONSTRAINT FK_CLIENTE_id
    FOREIGN KEY (FK_CLIENTE_id)
    REFERENCES CLIENTE (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
 
 ALTER TABLE LOCACAO ADD CONSTRAINT FK_EQUIPAMENTO_id
    FOREIGN KEY (FK_EQUIPAMENTO_id)
    REFERENCES EQUIPAMENTO (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;

 
ALTER TABLE MANUTENCAO ADD CONSTRAINT FK_EQUIPAMENTO1_id
    FOREIGN KEY (FK_EQUIPAMENTO_id)
    REFERENCES EQUIPAMENTO (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
    
    INSERT INTO CLIENTE (nome, endereco, e_mail, telefone, cpf, cnpj, tipo_cliente) VALUES
('Carlos Souza', 'Av. Brasil, 123', 'carlos.souza@email.com', '47999999999', '12345678901', NULL, 'Pessoa Física'),
('Empresa XYZ', 'Rua das Flores, 456', 'contato@xyz.com.br', '48988888888', NULL, '98765432100012', 'Pessoa Jurídica'),
('Maria Oliveira', 'Travessa das Árvores, 789', 'maria.oliveira@email.com', '47977777777', '10987654321', NULL, 'Pessoa Física'),
('Construtora ABC', 'Praça Central, 101', 'admin@abc.com.br', '48966666666', NULL, '12312312300034', 'Pessoa Jurídica'),
('João Pereira', 'Estrada Velha, 321', 'joao.pereira@email.com', '47955555555', '32165498702', NULL, 'Pessoa Física');

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
FLUSH PRIVILEGES;

ALTER TABLE CLIENTE
MODIFY cpf CHAR(11) NULL,
MODIFY cnpj CHAR(15) NULL;