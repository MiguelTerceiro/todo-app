const sqlite3 = require("sqlite3").verbose(); // importa SQLite
const db = new sqlite3.Database("./todo.db"); // cria/abre o ficheiro da BD

// Criação da tabela "tasks" (se não existir)
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            done INTEGER DEFAULT 0
        )
    `);
});

module.exports = db; // exporta a base de dados para outros ficheiros usarem
