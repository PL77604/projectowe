const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const rootDir = path.join(__dirname, '..');
const messagesFile = path.join(__dirname, 'messages.json');

// tworzymy plik messages.json, jeśli go nie ma
if (!fs.existsSync(messagesFile)) {
	fs.writeFileSync(messagesFile, '[]', 'utf8');
}

// Middleware
app.use(express.json());
app.use(express.static(rootDir));
function loadMessages() {
	const raw = fs.readFileSync(messagesFile, 'utf8');
	return JSON.parse(raw || '[]');
}

// Zapisywanie wiadomości
function saveMessages(messages) {
	fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf8');
}

app.post('/api/contact', (req, res) => {
	const { name, surname, email, message } = req.body;

	if (!name || !surname || !email || !message) {
		return res.status(400).json({ success: false, error: 'Wszystkie pola sa wymagane' });
	}

	const newMessage = {
		id: Date.now(),
		name,
		surname,
		email,
		message,
		timestamp: new Date().toLocaleString('pl-PL')
	};

	const messages = loadMessages();
	messages.push(newMessage);
	saveMessages(messages);

	console.log('Otrzymano wiadomosc:', newMessage);
	console.log('Zapisano. Laczna liczba wiadomosci:', messages.length);

	res.json({ success: true, message: 'Wiadomosc zostala zapisana na serwerze!' });
});

app.get('/', (req, res) => {
	res.sendFile(path.join(rootDir, 'index.html'));
});

// Start servera
app.listen(PORT, () => {
	console.log(`Serwer dziala na http://localhost:${PORT}`);
	console.log(`Oczekuje na POST /api/contact`);
});