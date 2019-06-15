const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')

const SENHA = 'renato@123'
const HASH = '$2b$04$OhEWu0gNEw8uoeYyAbuN0uPcS5wmhQG48OQ6fNZpFnQVGyGSbTR62'

describe('UserHelper test suite', function () {
    it('Deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA)
        //console.log('result', result)
        assert.ok(result.length > 10)
    })

    it('deve comparar uma senha e seu hash', async () => {
        const result = await PasswordHelper.comparePassword(SENHA, HASH)
        console.log('result', result)
        assert.ok(result)
    })
})