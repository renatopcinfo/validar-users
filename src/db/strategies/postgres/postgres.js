const ICrud = require('./../interfaces/interfaceCrud')
const Sequelize = require('sequelize');

class Postgres extends ICrud {
    constructor(connection, schema) {
        super() //chama a classe mae
        this._connection = connection
        this._schema = schema
        //this._connect();
    }

    async isConnected() {
        try {
            // await this._connect();
            await this._connection.authenticate();
            return true;
        } catch (error) {
            console.error('fail!', error);
            return false;
        }
    }

 static async defineModel(connection, schema) {
        const model = connection.define(
            schema.name, schema.schema, schema.options
        )
        await model.sync(); //sincroniza com o banco
        return model
    }

    async create(item) {
        const { dataValues } = await this._schema.create(item)

        return dataValues
    }

    async update(id, item, upsert = false) {
        const fn = upsert ? 'upsert' : 'update'
        return this._schema[fn](item, {
             where: {
                 id 
             }
             })
    }

    async delete(id) {
        const query = id ? { id } : {}
        return this._schema.destroy({ where: query })
    }

    async read(item = {}) {
        return this._schema.findAll({ where: item, raw: true });
    }


   static async connect() { // _ define metodo como privado
        const connection = new Sequelize(
            'heroes', //database
            'renato', // user
            '123.', //senha
            {
                host: 'localhost',
                dialect: 'postgres',
                // case sensitive
                quoteIdentifiers: false,
                // deprecation warning
                operatorsAliases: false,
                logging: false
            }
        )
        return connection
    }

}

module.exports = Postgres