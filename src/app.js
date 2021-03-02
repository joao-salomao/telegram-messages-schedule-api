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
// Rota que pega uma única mensagem cadastrada BD
app.get('/messages/:id', async (req, res) => {
    try {
        const message = await new Message({ id: req.params.id }).fetch({ withRelated: 'groups' })
        return res.send(message)
    } catch (error) {
        return res.status(500).send(error)
    }
})

// Rota que cadastra uma mensagem no BD
app.post('/messages', async (req, res) => {
    try {
        const data = {
            title: req.body.title,
            content: req.body.content,
            date_time: req.body.date_time
        }

        const message = await new Message(data).save()

        if (req.body.groups) {
            await message.groups().attach(req.body.groups)
            await message.load('groups')
        }

        return res.send(message)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})

// Rota que atualiza uma mensagem no BD
app.put('/messages/:id', async (req, res) => {
    try {
        const message = await new Message({ id: req.params.id })
            .save({
                title: req.body.title,
                content: req.body.content,
                date_time: req.body.date_time
            })

        if (req.body.groups) {
            await message.groups().detach()
            await message.groups().attach(req.body.groups)
            await message.load('groups')
        }

        return res.send(message)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Rota que deleta uma mensagem no BD
app.delete('/messages/:id', async (req, res) => {
    try {
        new Message({
            id: req.params.id
        }).destroy()

        res.send("Mensagem deletada")
    } catch (error) {
        res.status(500).send(error)
    }

})

// Começa a ouvir as requisições que chegam na porta especificada
const port = process.env.PORT || 9000
app.listen(port, () => {
    console.log("Listening on port: " + port)
})
