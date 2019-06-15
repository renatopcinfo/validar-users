const Sequelize = require('sequelize')

const UsuarioSchema = {
    name: 'usuarios',
    schema: {

        id: {
          type: Sequelize.INTEGER,
          required: true,
          primaryKey: true,
          autoIncrement: true,
        },
        username: {
          type: Sequelize.STRING,
          unique: true,
          required: true,
        },
        password: {
          type: Sequelize.STRING,
          required: true,
        },
      },
    options: {
        //opcoes para base existente
        tableName: 'tb_usuarios',
        freezeTableName: false,
        timestamps: false,

      }
}

module.exports = UsuarioSchema