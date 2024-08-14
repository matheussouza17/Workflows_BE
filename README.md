Projeto Workflows – Aprovação de Gastos
Este projeto visa criar um fluxo de aprovação de gastos, onde um usuário pode solicitar a aprovação de um gasto. O fluxo de aprovação segue as seguintes etapas:

Aprovação Inicial: Feita pelo gestor ou diretor do departamento do usuário que criou a solicitação.
Aprovação Contábil: Após a aprovação inicial, a solicitação é enviada para a contabilidade.
Aprovação Final: Caso necessário, a solicitação será enviada para um role superior à contabilidade, como o CFO.
Após a aprovação final, um PDF com a autorização do gasto será gerado, podendo ser baixado ou acessado a qualquer momento.

Estrutura das Aprovações
Cada aprovação inclui os seguintes campos:

Id: Identificador único.
Número: Número da aprovação.
Nome: Nome da solicitação.
Categoria: Categoria do gasto.
Descrição: Descrição detalhada do gasto.
Valor: Valor do gasto.
Criado Por: Usuário que criou a solicitação.
Data de Criação: Data em que a solicitação foi criada.
Categoria
As categorias podem ser cadastradas manualmente e possuem os seguintes campos:

Id: Identificador único.
Nome: Nome da categoria.
Descrição: Descrição detalhada da categoria.
Criado Por: Usuário que cadastrou a categoria.
Data de Criação: Data de criação da categoria.
Estrutura dos Processos
O processo controla todo o fluxo de aprovação e inclui as seguintes informações:

Id: Identificador único.
AprovaçãoId: Referência à aprovação associada.
Departamento de Origem: Departamento de onde a solicitação se originou.
Departamento de Destino: Departamento para onde a solicitação foi enviada.
Função/Role de Origem: Função do usuário que enviou a solicitação.
Função/Role de Destino: Função do usuário que receberá a solicitação.
Usuário Executor: Usuário que executou a ação.
Usuário de Destino: (Opcional) Usuário específico que receberá a solicitação.
Comentário: Comentário adicional sobre a ação.
Ação: Status da solicitação (aprovado, recusado, cancelado, não executado).
A ação é representada por um enum com os valores mencionados acima.

Estrutura dos Usuários
Os usuários possuem os seguintes campos:

Id: Identificador único.
Nome: Nome do usuário.
Email: Endereço de e-mail.
Password: Senha do usuário.
Foto: Arquivo binário contendo a foto do usuário.
Role/Função: Função do usuário no fluxo (Colaborador, Manager/Diretor, Contabilidade, CFO).
Data de Criação: Data de criação do usuário.
Departamento: Departamento ao qual o usuário pertence.
Estrutura dos Departamentos
Cada departamento possui:

Id: Identificador único.
Nome: Nome do departamento.
Código: Código do departamento.
Diretor de Aprovação: Diretor responsável pela aprovação no departamento (caso haja mais de um usuário com função de diretor).
