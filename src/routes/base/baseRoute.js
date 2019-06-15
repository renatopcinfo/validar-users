class BaseRoute {
    static methods() {
        return Object.getOwnPropertyNames(this.prototype)
            .filter(method => method !== 'constructor' && !method.startsWith('_')) // _ para metodos privados
        //nao vai retornar ser for um construtor e um metodo privado
    }

}

module.exports = BaseRoute