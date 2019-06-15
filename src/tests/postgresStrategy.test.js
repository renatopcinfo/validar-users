const assert = require('assert') //usado para validar variaveis , verificar se objetos estao de acordo 
// com nossa necessidade
const Postgres = require('./../db/strategies/postgres/postgres')
const HeroiSchema = require('./../db/strategies/postgres/schemas/heroiSchema')
const Context = require('./../db/strategies/base/contextStrategy')



const MOCK_HEROI_CADASTRAR = { //objeto
    nome: 'Gavião Negro',
    poder: 'Flexas'
}

const MOCK_HEROI_ATUALIZAR = { //objeto
    nome: 'Batman',
    poder: 'Dinheiro'
}

let context = {}
describe('Postgres Strategy', function () {
    this.timeout(Infinity) //aguarda tempo conexao banco
    this.beforeAll(async function () {
        const connection = await Postgres.connect()
        const model = await Postgres.defineModel(connection, HeroiSchema)
        context = new Context(new Postgres(connection, model))
        await context.delete();
        await context.create(MOCK_HEROI_ATUALIZAR);
    });
    it('PostgresSQL conection', async () => { // it usado para testar
        const result = await context.isConnected() //veficado se esta conectado
        assert.equal(result, true)
    })

    it('cadastrar', async () => {
        const result = await context.create(MOCK_HEROI_CADASTRAR)
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })

    it('listar', async () => {
        const [result] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome })
        //pegar a primeira posicao
        //const posicaoZero= result[0]
        // const [posicao1, posicao2] = ['esse é o 1', 'esse é o 2']
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })
    it('atualizar', async () => {
        const [itemAtualizar] = await context.read({ nome: MOCK_HEROI_ATUALIZAR.nome })
        const novoItem = {
            ...MOCK_HEROI_ATUALIZAR,
            nome: 'Mulher Maravilha'
        }
        const [result] = await context.update(itemAtualizar.id, novoItem)
        const [itemAtualizado] = await context.read({ id: itemAtualizar.id })
        assert.deepEqual(result, 1)
        assert.deepEqual(itemAtualizado.nome, novoItem.nome)
    })

    it('remover por id', async () => {
        const [item] =  await context.read({})
        const result = await context.delete(item.id)
        assert.deepEqual(result, 1)
    })

})




