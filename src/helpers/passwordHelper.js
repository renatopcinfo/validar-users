const Bcrypt = require('bcrypt')

const {
    promisify   //transformando em promisse pois bcrypt trabalha com call back
} = require('util')

const hashAsync = promisify(Bcrypt.hash)
const compareAsync = promisify(Bcrypt.compare)
const SALT = 3 // sera o nivel de complexidade do algoritmo

class PasswordHelper {
    
    static hashPassword (pass) {
        return hashAsync(pass, SALT)
    }

    static comparePassword(pass, hash) {
        return compareAsync(pass, hash)
    }
}

module.exports = PasswordHelper

