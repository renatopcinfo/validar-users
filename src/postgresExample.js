// npm install sequelize
// npm install pg-hstore pg // driver de conexao do banco

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'heroes', //database
    'renato', // user
    '123.', //senha
    {
        host: 'localhost',
        dialect: 'postgres',
        // case sensitive
        quoteIdentifiers: false,
        // deprecation warning
        operatorsAliases: false

        // dialectOptions: {
        //   ssl: true,
        // },
    },
);

(async () => {
    const Herois = sequelize.define(
        'herois',
        {
            id: {
                type: Sequelize.INTEGER,
                required: true,
                primaryKey: true,
                autoIncrement: true,
            },
            nome: {
                type: Sequelize.STRING,
                required: true,
            },
            poder: {
                type: Sequelize.STRING,
                required: true,
            },
        },
        {
            //opcoes para base existente
            tableName: 'TB_HEROIS',
            freezeTableName: false, //nao alterar opcoes do banco
            timestamps: false, //nao criar propriedade que ele cria sozinho


        },
    );

    // force: true will drop the table if it already exists
    await Herois.sync(); //sincroniza com o banco
    // Table created
     const result = await Herois.create({
       nome: 'Renato',
       poder: 'Teste',
     });
    console.log('result', await Herois.findAll({ raw: true, attributes: ['nome', 'poder', 'id'] }),
    );
})
(); //chama funcao async do inicio
