const {MongoClient} = require('mongodb');
let _db = null;


async function connect(MONGO_URL, DB_NAME) {
    const client = await MongoClient.connect(MONGO_URL);

    // same as switching the database
    const db = client.db(DB_NAME);
    _db = db;
    return db;
}

function getDB(){
    return _db;
}

module.exports = {
    connect, getDB
};