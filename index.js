const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Conectar ao MySQL
const connection = mysql.createConnection({
  host: '186.202.152.60',
  user: 'administrasite',
  password: 'fkb@dom2012',
  database: 'administrasite'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro de conexão ao MySQL:', err);
  } else {
    console.log('Conectado ao MySQL');
  }
});

// Middleware para analisar o corpo das solicitações
app.use(bodyParser.json());

// Rotas CRUD
app.post('/items', (req, res) => {
  const newItem = { nome: req.body.nome };
  connection.query('INSERT INTO items SET ?', newItem, (error, results) => {
    if (error) throw error;
    newItem.id = results.insertId;
    res.json(newItem);
  });
});

app.get('/items', (req, res) => {
  connection.query('SELECT * FROM items', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.get('/items/:id', (req, res) => {
  const itemId = req.params.id;
  connection.query('SELECT * FROM items WHERE id = ?', [itemId], (error, results) => {
    if (error) throw error;
    res.json(results[0]);
  });
});

app.put('/items/:id', (req, res) => {
  const itemId = req.params.id;
  const updatedItem = { nome: req.body.nome };
  connection.query('UPDATE items SET ? WHERE id = ?', [updatedItem, itemId], (error, results) => {
    if (error) throw error;
    res.json(updatedItem);
  });
});

app.delete('/items/:id', (req, res) => {
  const itemId = req.params.id;
  connection.query('DELETE FROM items WHERE id = ?', [itemId], (error, results) => {
    if (error) throw error;
    res.json({ id: itemId });
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});