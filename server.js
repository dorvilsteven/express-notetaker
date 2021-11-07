const fs = require('fs');
const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3005;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));

const { notes } = require('./db/db');

// helpers
function createNewNote(body, array) {
    const note  = body;
    array.push(note);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({notes: array}, null, 2)
    );

    return note;
}

function validate(body) {
    if (!body.title || typeof body.title !== 'string') {
        return false;
    }
    if (!body.text || typeof body.text !== 'string') {
        return false;
    }
    return true;
}
function findById(id, array) {
    const result = array.filter((note) => note.id === id)[0];
    return result;
}


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    let results = notes;
    res.json(results);
});

app.get('/api/notes/:id', (req, res) => {
  const result = findById(req.params.id, notes);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

app.post('/api/notes', (req, res) => {
    let body = req.body;
    body.id = notes.length.toString();
    if (!validate(body)) {
        res.status(400).send('The note is not properly formatted.');
    } else {
        const note = createNewNote(body, notes);
        res.json(note);
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`server now on port ${PORT}!`);
});