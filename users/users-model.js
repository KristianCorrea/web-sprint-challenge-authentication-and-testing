const db = require("../database/dbConfig");

module.exports = {
    add,
    find,
    findBy,
    findById
}

function find() {
    return db("users").select("id", "username").orderBy("id");
}

function findBy(filter) {
    return db("users as u")
        .where(filter)
        .orderBy("u.id");
}

async function add(user) {
    try {
        const [id] = await db("users").insert(user, "id");

        return findById(id);
    }catch{
        throw error;
    }
}

function findById(id) {
    return db("users").where({id}).first();
}