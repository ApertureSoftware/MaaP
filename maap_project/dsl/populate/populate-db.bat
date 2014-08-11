mongoimport --host localhost --port 27017 --db dati --drop --collection teams < teams.json
mongoimport --host localhost --port 27017 --db dati --drop --collection coaches < coaches.json
mongoimport --host localhost --port 27017 --db dati --drop --collection members < members.json
mongoimport --host localhost --port 27017 --db dati --drop --collection supermarket < supermarket.json
mongoimport --host localhost --port 27017 --db dati --drop --collection positions < positions.json