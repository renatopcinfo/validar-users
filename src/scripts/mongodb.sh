# conexao com docker
docker exec -it 34970567f478 mongo -u renato -p admin --authenticationDatabase herois

show dbs
use herois
show collections # mostra as tabelas (colecoes)

# criando banco de inserindo dados
db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

db.herois.find() #lista todos os dados do banco
db.herois.find().pretty() #lista todos os dados do banco traz formatado
db.herois.find({ nome: 'Flash' }) #lista todos com nome flash

#inserindo dados com for
for (let i = 0; i <= 50000; i++) {
    db.herois.insert({
        nome: `Clone-${i}`,
        poder: 'Velocidade',
        dataNascimento: '1998-01-01'
    })
}

db.herois.count() #mostra quantidade de dados
db.herois.findOne() # traz um dado
db.herois.find().limit(10).sort({ nome: -1 })
db.herois.find({}, { poder: 1, _id: 0 }) #// traz tudo da coluna poder e oculta o id

#//creat
db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

#//read
db.herois.find()

#//update  obs dessa forma apaga o id
db.herois.update({ _id: ObjectId("5cf44358aae64a4a3ade74ee") }, { nome: 'Mulher Maravilha' })

#// dessa forma atualiza somente nome
db.herois.update({ _id: ObjectId("5cf4456caae64a4a3ade78d7") }, { $set: { nome: 'Lanterna Verde' } })

#//dessa forma atualiza somente 1 por questao de segurança
db.herois.update({ poder: 'Velocidade' }, { $set: { poder: 'Super Força' } })

#//delete remove todos os dados
db.herois.remove({nome: 'Mulher Maravilha' })