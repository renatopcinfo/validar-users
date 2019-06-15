//npm i hapi
//npm i boom
//npm i vision inert hapi-swagger
//npm i hapi-auth-jwt2 (vai exigir token)
//npm i bcrypt
const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const Mongodb = require('./db/strategies/mongodb/mongodb')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema')
const HeroRoute = require('./routes/heroRoutes')
const AuthRoute = require('./routes/authRoutes')

const Postgres = require('./db/strategies/postgres/postgres')
const UsuarioSchema = require('./db/strategies/postgres/schemas/usuarioSchema')

const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')

const HapiJwt = require('hapi-auth-jwt2')
const JWT_SECRET = 'MEU_SEGREDO_ADMIN'

const app = new Hapi.Server({
    port: 5000
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = Mongodb.connect()
    const context = new Context(new Mongodb(connection, HeroiSchema))

    const connectionPostgres = await Postgres.connect()
    const usuarioSchema = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
    const contextPostgres = new Context(new Postgres(connectionPostgres, usuarioSchema))

    const swaggerOptions = {
        info: {
            title: 'API Heróis - Node',
            version: 'v1.0',
        },
        //lang: 'pt' dá erro
    }
    await app.register([ //usado para registrar modulos e conectar a outros
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,

        validate: (dado, request) => {
            // verifica no banco se o usuario continua ativo
            // verifica no banco se o usuario continua pagando
            return {

                isValid: true //caso nao valide false
            }
        }
        
    })

    app.auth.default('jwt') // por padrao vai usar o noso schema criado 

    app.route([

        ...mapRoutes(new HeroRoute(context), HeroRoute.methods()), //retorna todas rotas CRUD em forma de  array
        ...mapRoutes(new AuthRoute(JWT_SECRET, contextPostgres), AuthRoute.methods()) //... concatena objetos(rest Spread)
    ]
    )

    await app.start(
        console.log('Server on na porta', app.info.port))

    return app
}

module.exports = main()