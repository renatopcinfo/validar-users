## ---- POSTGRES
docker run --name postgres -e POSTGRES_USER=renato -e POSTGRES_PASSWORD=123. -e POSTGRES_DB=heroes -p 5432:5432 -d postgres

docker exec -it postgres /bin/bash

docker run --name adminer -p 8080:8080 --link postgres:postgres -d adminer (INSTALACAO ADMINER)

## ---- MONGODB
docker run --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin -d mongo:4

docker run --name mongoclient -p 3000:3000 --link mongodb:mongodb -d mongoclient/mongoclient (INSTALACAO MONGO CLIENT) NAO FUNCIONOU

docker run -d -p 3000:3000 mongoclient/mongoclient (ESSE DEU CERTO)



docker exec -it mongodb mongo --host localhost -u admin -p admin --authenticationDatabase admin --eval "db.getSiblingDB('herois').createUser({user: 'renato', pwd: 'admin', roles: [{role: 'readWrite', db: 'herois'}]})"

//parando docker tudo
docker stop $(docker ps -a -q)