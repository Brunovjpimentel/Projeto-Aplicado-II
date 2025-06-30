  O repositório inclui algumas soluções para as dificuldades apresentadas na Demanda da Indústria Gestão Inteligente de Equipamentos de Informática Locados.

  Algumas de suas soluções são:
  - Controle de Clientes: Registros individuais de Pessoas Físicas ou Jurídicas.
  - Controle de Equipamentos: Catálogo de equipamentos com registro de seu estado atual.
  - Sistema de Acompanhamento de Contratos: É possível registrar contratos de locação com o cliente e o equipamento alugado, assim sendo possível verificar datas de devoluções próximas ou atrasadas, como também atualizar dados ou remover contratos registrados.
    
  As tecnologias utilizadas foram:
  - **Frontend:**	React, React Router
  - **UI Framework:** Bootstrap 5
  - **Backend:** Node.js, Express
  - **Database:** MySQL
  - **HTTP Client:** Axios

  O código foi organizado em uma pasta para o backend e uma pasta para o frontend, sendo os arquivos mais importantes do frontend:
- ..src/
- ./pages/ -----> Pasta com as páginas disponíveis.
- ./pages/Cliente.js -----> Cadastro de Cliente;
- ./pages/Equipamento.js -----> Cadastro de Equipamento;
- ./pages/Contrato.js -----> Cadastro de Contratos;
- ./pages/ListarContrato.js -----> Lista de Contratos com Ordenação;
- ./pages/EditarContrato.js -----> Edição de Contratos Selecionados na Lista;
- ../App.js -----> Router/Navegador de Páginas.

E o backend com o server.js que inclui todos os get, post, delete, query necessários para o CRUD, como também a conexão com o banco de dados SQL.
  
 Alguns exemplos de funções já disponíveis do server.js são:
- **/clientes	GET:**	Lista todos os clientes, utilizado para selecionar um cliente na criação de um contrato.
- **/clientes	POST:** Registra um novo cliente.
- **/equipamento GET:** Lista todos os equipamentos, utilizado para selecionar um equipamento na criação de um contrato.
- **/equipamento POST:** Registra um novo equipamento.
- **/contrato	POST:** Cria um novo contrato.
- **/listarcontratos GET:**	Pesquisa por contratos utilizando parâmetros, utilizado na busca de contratos por características.
- **/contrato/:id	GET:** Coleta as informações do equipamento para a edição.
- **/contrato/:id	PUT:** Atualiza os dados do contrato conforme a edição.
- **/listarcontratos/:id DELETE:** Apaga o contrato selecionado.
