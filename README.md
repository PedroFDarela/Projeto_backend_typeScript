# Projeto_backend_V2_typeScript
## Aplicativo para você encontrar o herói mais próximo de você e que possa atender as suas necessidades.
<h4 align="center"> 
	🚧   🚀 Em construção...  🚧
</h4>

### 🎲 Rodando a API 


```bash
# Instale as dependências
$ npm install

# Para executar a aplicação em modo de desenvolvimento
$ npm run dev

# Para executar os testes automatizados
$ npm test

# Para gerar a build do app
$ npm run build

# Para executar a API em produção(primeiro build)
$ npm start

# Criar o arquivo .env com a url da banco Mongodb e com uma chave para o Jsonwebtoken
# Já existe um .env.test com a url de um banco local, que só servira para rodar os testes.
# pode escolher uma porta para o server também

# O servidor inciará na porta:3000 - acesse <http://localhost:3000/api/heros>

```

### 🎲 Rotas API 


```bash
$ GET/api/heros
#
# Retorna todos os heróis, mas é possivel passar campos(mesmos nomes que os campos do BD) por query params para refinar a busca
# por segurança o usuario não tem cesso ao nome real dos herois.
#
$ GET/api/heros/SOS
#
# Tem que passar(por query params) o tipo de desastre e a cidade que esta acontecendo, a api vai selecionar alguns herois disponiveis.
#
$ GET/api/heros/:codinome
#
# Retorna o heroi que o codinome foi passado por parametro
#
$ POST/api/new-hero
#

# Cria um novo herois, vc passa os dados por json no corpo da requisição, todos os campos são necessarios, menos o campo trabalho e equipe, que
# se ficar em branco ganha um valor por padrão, a resposta o usuario ganha um token(vida de 60 segundos), que servira para gerir sua conta
# {
#	"nome_real": "Steve Rogers",
#	"password": "Steve Rogers",
#	"codinome": "Capitão América",
#	"tipo_desastre": [
#		"assalto a bancos",
#		"desastres naturais"
#	],
#	"cidades": [
#		"New York"
#	],
#	"trabalho_equipe": "indiferente"
# }
#
$ POST/api/authenticate
#
# Fazer login na conta do herói
# {
#	"codinome": "Capitão América",
#	"password": "Steve Rogers"
# }
#
$ PUT/api/heros/:codinome
#
#
# Caso o herói queira mudar algum dado de sua conta ele vai ter que mandar quais quer mudar,  junto com o token de autentificação, alem de passar o seu   # codinome por parametro
#
# {
#	"trabalho_equipe": "indiferente"
# }
#
$ DELELETE/api/heros/:codinome
#
# Caso o herói queira excluir sua conta ele tem que mandar o teoken de autentificação(Authoriza) e o seu codinome por parametro
#
$ Formato do token:
# o formato do token é <Bearer Token>
# ele é enviado no campo Authorization do Header da requisição
#
```
