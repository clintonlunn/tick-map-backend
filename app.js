const express = require('express');
const db = require('./database');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello from Tick Map Backend!');
});

app.get('/user-ticks', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM user_ticks');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = app;
