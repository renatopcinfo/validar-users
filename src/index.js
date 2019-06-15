const ContextStragety = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb')
const Postgres = require('./db/strategies/postgres')

const contextMongo = new ContextStragety(new MongoDB())
contextMongo.create()

const contextPostgres = new ContextStragety(new Postgres())
contextPostgres.create()