//npm install mongoose
const Mongoose = require('mongoose')

Mongoose.connect('mongodb://renato:admin@localhost:27017/herois',
{useNewUrlParser: true}, (error) => {
    if(!error) return;
    console.log('Falha ao conectar no banco de dados!', error)
})

const connection = Mongoose.connection //salvando a conexao

//mostra estado da conexao
/* connection.once('open', () => console.log('database rodando!'))
setTimeout(() => {
    const state = connection.readyState
    console.log('state', state)

}, 1000) */

/* 
estados de conexao
0: Desconectado
1: Conectado
2: Conectando
3: Desconectando */

const heroiSchema = new Mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    poder: {
        type: String,
        required: true
    },
    insertedAt: {
        type: Date,
        default: new Date() //insere a data atual
    }
})
const model = Mongoose.model('herois', heroiSchema)

async function main () {
    const resultCadastrar = await model.create({
        nome: 'Batman',
        poder: 'Dinheiro'
    }) 
    console.log('result cadastrar', resultCadastrar)

    const listItens = await model.find()
    console.log('itens', listItens)
}
main()