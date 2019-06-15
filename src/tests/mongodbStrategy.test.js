const assert = require('assert') //usado para validar variaveis , verificar se objetos estao de acordo 
// com nossa necessidade
const Mongodb = require('./../db/strategies/mongodb/mongodb')
const HeroiSchema = require('./../db/strategies/mongodb/schemas/heroisSchema')
const Context = require('./../db/strategies/base/contextStrategy')

const MOCK_HEROI_CADASTRAR = {
    nome: 'Mulher Maravilha',
    poder: 'Laço'
}
const MOCK_HEROI_DEFAULT = {
    nome: `Homem Aranha-${Date.now()}`,
    poder: 'Super Teia'
}
const MOCK_HEROI_ATUALIZAR = {
    nome: `Patolino-${Date.now()}`,
    poder: 'Velocidade'
}
let MOCK_HEROI_ID = ''

let context = {}

describe('MongoDB suíte de testes', function () {
    this.beforeAll(async () => { // conecta no banco antes
        const connection = Mongodb.connect() //nao usei new pois é static
        context = new Context(new Mongodb(connection, HeroiSchema))

        await context.create(MOCK_HEROI_DEFAULT)
        const result = await context.create(MOCK_HEROI_ATUALIZAR)
        MOCK_HEROI_ID = result._id;
    })
    it('Verificar conexão', async () => {
        const result = await context.isConnected()
       // console.log('result', result)
        const expected = 'Conectado'

        assert.deepEqual(result, expected)
    })

    it('cadastrar', async () => {
        const {nome, poder} = await context.create(MOCK_HEROI_CADASTRAR)
        assert.deepEqual({nome, poder}, MOCK_HEROI_CADASTRAR)
    })

    it('listar', async () =>{
       const [{nome, poder}] = await context.read({nome: MOCK_HEROI_DEFAULT.nome})
       const result = {nome, poder}
       assert.deepEqual(result, MOCK_HEROI_DEFAULT)
    })

    it('atualizar', async () =>{
        const result = await context.update(MOCK_HEROI_ID, {
            nome: 'Pernalonga'
        })
        assert.deepEqual(result.nModified, 1) // 1 true
    })

    it('remover', async () =>{
        const result = await context.delete(MOCK_HEROI_ID)
        assert.deepEqual(result.n, 1) //retorna quantidade de item removidos, espera que remova 1
    })
})