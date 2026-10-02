const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET cars listing
router.get('/cars', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM autok');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single car
router.get('/cars/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM autok WHERE id = ?', [req.params.id]);
    if (rows.length===0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST new car
router.post('/cars', async (req, res) => {
  const { marka, tipus, evjarat, napi_dij } = req.body;
  // validation
  if (!marka || !tipus || !evjarat || !napi_dij) {
    return res.status(400).json({ error: 'Hiányzó adatok' });
  }

  try {
    const [result] = await pool.query('INSERT INTO autok (marka, tipus, evjarat, napi_dij) VALUES (?, ?, ?, ?)', [marka, tipus, evjarat, napi_dij]);
    res.status(201).json({ id: result.insertId, marka, tipus, evjarat, napi_dij });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Törlés
router.delete('/cars/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'Hiányzó ID' });
    }
    const [result] = await pool.query('DELETE FROM autok WHERE id = ?', [id]); 
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Nem található az autó' });
    }
    res.json({ message: 'Sikres törlés' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;