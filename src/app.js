const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')

// Carrega todas as variáveis de ambiente cadastradas 
// no arquivo .env para a variável global process.env
require('dotenv').config()

// Importa as modelos do banco de dados definidas no arquivo db.js
const { Message, Group } = require('./db')

// Cria uma instância do express
const app = express()

// Adiciona o middleware cors na aplicação
app.use(cors())

// Adiciona o middleware bodyParser que transforma 
// o body da requisição em um json
app.use(bodyParser.json())

// Rota que pega todos os grupos cadastrados no BD
app.get('/groups', async (req, res) => {
    try {
        const groups = await Group.fetchAll()
        return res.send(groups)
    } catch (error) {
        return res.status(500).send(error)
    }
})

// Rota que pega todas mensagens cadastradas BD
app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.fetchAll({ withRelated: 'groups' })
        return res.send(messages)
    } catch (error) {
        return res.status(500).send(error)
    }
})
