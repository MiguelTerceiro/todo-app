const express = require("express");
const cors = require("cors");
const db = require("./db");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend"))); // Aqui está a mudança!

// Rotas da API
app.get("/api/tasks", (req, res) => {
    db.all("SELECT * FROM tasks", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post("/api/tasks", (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Texto obrigatório." });
    db.run("INSERT INTO tasks (text) VALUES (?)", [text], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, text, done: 0 });
    });
});

app.put("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { done } = req.body;
    db.run("UPDATE tasks SET done = ? WHERE id = ?", [done, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ updated: this.changes });
    });
});

app.delete("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM tasks WHERE id = ?", [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor a correr em http://localhost:${PORT}`));
