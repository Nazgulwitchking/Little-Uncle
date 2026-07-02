const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Erlaubt deiner App, Daten an diesen Server zu senden

const USERS_FILE = path.join(__dirname, 'users.json');

// Hilfsfunktion: Nutzer aus der JSON-Datei lesen
const readUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return {};
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data || '{}');
};

// Hilfsfunktion: Nutzer in die JSON-Datei schreiben
const writeUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// API: Registrierung
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();

    if (users[username]) {
        return res.status(400).json({ error: 'Benutzername existiert bereits.' });
    }

    users[username] = {
        password: password,
        userdata: {} // Hier landen automatisch alle LocalStorage-Daten
    };

    writeUsers(users);
    res.json({ token: 'secret-token-' + username, msg: 'Erfolgreich registriert!' });
});

// API: Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();

    const user = users[username];
    if (!user || user.password !== password) {
        return res.status(400).json({ error: 'Falscher Benutzername oder Passwort.' });
    }

    res.json({ 
        token: 'secret-token-' + username, 
        userdata: user.userdata 
    });
});

// API: Automatisches Speichern aller Daten aus deiner App/Extensions
app.post('/api/save-all-data', (req, res) => {
    const token = req.headers['authorization'];
    const { userData } = req.body;

    if (!token || !token.startsWith('secret-token-')) {
        return res.status(401).json({ error: 'Nicht autorisiert.' });
    }

    const username = token.replace('secret-token-', '');
    const users = readUsers();

    if (users[username]) {
        users[username].userdata = userData;
        writeUsers(users);
        return res.json({ success: true });
    }

    res.status(404).json({ error: 'User nicht gefunden.' });
});

app.listen(3000, () => {
    console.log('Little Uncle Backend läuft stabil auf http://localhost:3000 ✓');
});
