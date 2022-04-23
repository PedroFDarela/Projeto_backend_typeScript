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
$ GET/api/heros/SOS
$ GET/api/heros/:codinome
$ POST/api/new-hero
$ POST/api/authenticate
$ PUT/api/heros/:codinome
$ DELELETE/api/heros/:codinome
```
