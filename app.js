const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    // Handle registration logic here
    res.json({ success: true, message: 'Registration successful' });
});

app.post('/login', (req, res) => {
    const { loginUser, loginPass } = req.body;
    // Handle login logic here
    res.json({ success: true, message: 'Login successful' });
});

app.post('/pay', (req, res) => {
    const { method } = req.body;
    // Handle payment logic here
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
