import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();
app.use(express.json());

app.get('/data-categories', async (req, res) => {
  const query = `SELECT * FROM Categories`;
  const [rows] = await pool.query(query);
  res.json(rows);
});

app.put('/data-create-transaction', async (req, res) => {
  const query = `INSERT INTO Transactions (description, date, amount, transactionId, note, categoryId, isHidden, parentId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const [rows] = await pool.query(query, [
    req.body.description,
    req.body.date,
    req.body.amount,
    req.body.transactionId,
    req.body.note,
    req.body.categoryId,
    req.body.isHidden,
    req.body.parentId,
  ]);
  res.json(rows);
});

app.put('/data-update-transaction', async (req, res) => {
  const query = `UPDATE Transactions SET categoryId = ?, note = ?, isHidden = ?, parentId = ? WHERE transactionId = ?`;
  const [rows] = await pool.query(query, [
    req.body.categoryId,
    req.body.note,
    req.body.isHidden,
    req.body.parentId,
    req.body.transactionId,
  ]);
  res.json(rows);
});

app.put('/data-update-category', async (req, res) => {
  const query = `UPDATE Categories SET categoryName = ?, \`limit\` = ?, note = ? WHERE id = ?`;
  const [rows] = await pool.query(query, [
    req.body.categoryName,
    req.body.limit,
    req.body.note,
    req.body.id,
  ]);
  res.json(rows);
});

app.put('/data-update-last-import', async (req, res) => {
  const query = `UPDATE Imports SET lastImportDate = ? WHERE id = 1`;
  const [rows] = await pool.query(query, [req.body.lastImportDate]);
  res.json(rows);
});

app.get('/data-last-import', async (req, res) => {
  const query = `SELECT * FROM Imports`;
  const [rows] = await pool.query(query);
  res.json(rows);
});

app.post('/data-transactions', async (req, res) => {
  const query = `SELECT * FROM Transactions WHERE MONTH(date) = ? AND YEAR(date) = ?`;
  const [rows] = await pool.query(query, [req.body.month, req.body.year]);
  res.json(rows);
});

app.post('/post', async (req, res) => {
  const query = `SELECT * FROM Transactions INNER JOIN Categories ON Categories.id = Transactions.categoryId WHERE Transactions.categoryId = ?`;
  const [rows] = await pool.query(query, [req.body.id]);
  res.json(rows);
});

// These two lines are needed for ES Modules (__dirname replacement)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from 'dist' (Vite builds into 'dist' by default)
app.use(express.static(path.join(__dirname, '../../dist')));

// Fallback: serve index.html for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
});

// Export the app for Vercel
export default app;
