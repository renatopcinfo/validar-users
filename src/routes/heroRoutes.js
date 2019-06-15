const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')

const failAction = (request, headers, erro) => {
    throw erro;
}

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

class HeroRoutes extends BaseRoute { //extends vai trazer o method
    constructor(db) {
        super() //sempre que usar extends tem que chamar a classe pai primeiro com o super()
        this.db = db
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'Deve lista herois',
                notes: 'pode paginar resultados e filtrar por nome',
                validate: {
                    // payload - body da requisicao
                    // headers - cabecalho da request(header)
                    // params - na URL: id
                    // query - ?skip=0&limit=100
                    failAction,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    },
                    headers

                }
            },
            handler: (request, headers) => {
                try {
                    const {
                        skip,
                        limit,
                        nome
                    } = request.query //vai extrai skip, limit, nome
                    //throw Error('deu ruim') simular erro

                    const query = nome ? {
                        nome: {
                            $regex: `.*${nome}*.`
                        } //regex - operador do mongodb
                    } : {}

                    return this.db.read(nome ? query : {}, skip, limit)

                } catch (error) {
                    console.log('Erro encontrado', error)
                    return Boom.internal()
                }
            }
        }
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Deve cadastrar heroi',
                notes: 'deve cadastrar heroi por nome e poder',
                validate: {
                    failAction,
                    headers,
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(2).max(100)
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { nome, poder } = request.payload
                    const result = await this.db.create({
                        nome, poder
                    })
                    // console.log('result', result)
                    return {
                        message: 'Heroi cadastrado com sucesso!',
                        _id: result._id
                    }

                } catch (error) {
                    console.log('Erro encontrado', error)
                    return Boom.internal()
                }
            }
        }
    }

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Deve atualizar heroi por id',
                notes: 'pode atualizar qualquer campo',
                validate: {
                    params: {
                        id: Joi.string().required()
                    },
                    headers,
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(3).max(100),
                    }
                }
            },
            handler: async (request) => {
                try {
                    const {
                        id  //extraindo somente o id
                    } = request.params;

                    const {
                        payload
                    } = request

                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString) //vai remover todas chaves sem valor

                    const result = await this.db.update(id, dados)

                    if (result.nModified !== 1) return Boom.preconditionFailed('Id não encontrado no banco')

                    return {
                        message: 'Heroi atualizado com sucesso!'
                    }

                } catch (error) {
                    console.log('Erro encontrado', error)
                    return Boom.internal()

                }
            }
        }

    }

    delete() {
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'Deve remover o heroi por id',
                notes: 'O ID tem que ser valido',
                validate: {
                    failAction,
                    headers,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {    //passo no config ele recebe a requisicao
                try {
                    const { id } = request.params
                    const result = await this.db.delete(id)
                    if (result.n !== 1)
                        return Boom.preconditionFailed('id não encontrado no banco!')

                    return {
                        message: 'Heroi removido com sucesso!'
                    }

                } catch (error) {
                    console.log('Erro encontrado', error)
                    return Boom.internal()

                }
            }

        }
    }


}

module.exports = HeroRoutes