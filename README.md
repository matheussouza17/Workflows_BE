Projeto Workflows – Aprovação de Gatos

O projeto consiste em um fluxo para aprovação de gastos para o usuário que a criou, aonde terá aprovação de primeira instancia do gestor/diretor de seu departamento, após terá aprovação da contabilidade, e após de algum role que seja acimada contabilidade.
Assim que aprovado, será gerado um pdf com a autorização deste gasto, sendo possível o seu download ou acesso a qualquer momento.

A aprovação terá:
	Id;
	Número;
	Nome;
	Categoria;
	Descrição;
	Valor;
	Quem criou;
	Quando Criou;
Sendo que a categoria pode ser cadastrada manualmente, e ela possui:
	Id;
	Nome;
	Descrição;
	Quem criou;
	Quando criou;
Já o processo, será o que fará controle de todo o fluxo, ele possui as informações da aprovação:
	Id;
	AprovaçãoId;
	Departamento de Origem;
	Departamento de Destino;
	Função/Role de origem;
	Função/Role de destino;
	Usuário que executou;
	Usuário de destino (caso tenha um em específico);
	Comentário;
	Qual foi a ação (aprovado, recusado, cancelado, não executado);
A ação será um enum com os atributos acima.

Já o User terá:
	id;
	Nome;
	Email;
	Password;
	File (arquivo binário com foto);
	Role/Função;
	Data de criação;
	Departamento;
As roles também são enums, que são as funções do fluxo, ou seja, Colaborador, Manager/Diretor, Contabilidade, e o CFO, não sei, algo que seja maior que contabilidade.
Já os departamentos terão:
	Id;
	Nome;
	Código;
	Diretor de Aprovação (este passo é para caso aconteça de um mesmo departamento ter mais de um usuário com role de diretor);


![image](https://github.com/matheussouza17/Workflows_BE/assets/109185171/7fe52af3-b67f-4434-94b9-54f67a2163f6)
