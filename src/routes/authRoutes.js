const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')
// npm i jsonwebtoken
const jwt = require('jsonwebtoken')
const PasswordHelper = require('./../helpers/passwordHelper')


const failAction = (request, headers, erro) => {
    throw erro;
}

const USER = {
    username: 'admin',
    password: '123'
}

class AuthRoutes extends BaseRoute {
    constructor(secret, db) {
        super()
        this.secret = secret
        this.db = db
    }
    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false, //para nao gerar token para a rota
                tags: ['api'], //mostra o swagger
                description: 'Obter token',
                notes: 'Faz login com user e senha',
                validate: {
                    failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            }, //se validacao passar entra no handler
            handler: async (request) => {
                const {
                    username,
                    password
                } = request.payload

                const [usuario] = await this.db.read({ //busca user no banco
                    username: username.toLowerCase()
                })
                if (!usuario) {
                    return Boom.unauthorized('Usuário não existe')
                }
                //comparando senha se esta no banco
                const match = await PasswordHelper.comparePassword(password, usuario.password)

                if (!match) {
                    return Boom.unauthorized('Usuario ou senha invalido')
                }
                /* if (
                    username.toLowerCase() !== USER.username ||
                    password !== USER.password
                    )

                    return Boom.unauthorized() */

                const token = jwt.sign({
                    username: username,
                    id: usuario.id
                }, this.secret)

                return {
                    token
                }

            }
        }
    }
}

module.exports = AuthRoutes