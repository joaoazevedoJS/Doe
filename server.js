// configurando o servidor
const express = require('express')

const server = express()

// Configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))


// habilitar body do formulario!
server.use(express.urlencoded({ extended: true }))

// Configurar a conexão com o banco de dados (SQL)
const Pool = require('pg').Pool

const db = new Pool({
    user: 'postgres',
    password: 'SENHA',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
})


// Configurando a template engine
const nunjucks = require('nunjucks')
nunjucks.configure('./', {
    express: server,
    noCache: true,
})

// configurar a apresentação da página
server.get("/", (request, response) => {
    db.query("SELECT * FROM donors", (err, result) => {
        if(err) {
            return res.send("Erro de banco de dados!")
        }

        const donors = result.rows;

        return response.render('index.html', { donors })
    })
})

// pegar dados do formulario
server.post('/', (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == "") {
        return res.send('Todos os campos são obrigatórios!')
    }

    // valores dentro do banco de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`;

    // O $1, $2 e $3 vai substituir o valores pelo segundo parametro [$1, $2, $3]

    const values = [name, email, blood]

    db.query(query, values, (err) => {
        if(err) {
            return res.send('Erro no banco de dados!')
        }

        return res.redirect("/")
    })    
})

// Ligar o servidor e permitir o acesso a porta 3000
server.listen(3000, function() {
    console.log('Iniciando sevidor...\n http://localhost:3000')
})