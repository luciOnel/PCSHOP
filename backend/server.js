const path = require('path');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');


const {
    findUserByEmail,
    createUser,
    recordLoginAttempt
} = require('./database');

const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);

const app = express();

app.use(cors());
app.use(express.json());

const sanitizeEmail = (email) => (email || '').trim().toLowerCase();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isStrongPassword = (password) => typeof password === 'string' && password.length >= 6;

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Не заполнены обязательные поля.' });
        }

        const normalizedEmail = sanitizeEmail(email);

        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({ message: 'Некорректный email.' });
        }

        if (!isStrongPassword(password)) {
            return res.status(400).json({ message: 'Пароль должен содержать не менее 6 символов.' });
        }

        const existingUser = await findUserByEmail(normalizedEmail);
        if (existingUser) {
            return res.status(409).json({ message: 'Пользователь с таким email уже зарегистрирован.' });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await createUser({ name: name.trim(), email: normalizedEmail, passwordHash });

        res.status(201).json({ user });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Ошибка регистрации пользователя.' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ message: 'Необходимо указать email и пароль.' });
        }

        const normalizedEmail = sanitizeEmail(email);
        const user = await findUserByEmail(normalizedEmail);

        if (!user) {
            await recordLoginAttempt({ email: normalizedEmail, success: false, details: 'Пользователь не найден' });
            return res.status(401).json({ message: 'Неверный email или пароль.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            await recordLoginAttempt({ userId: user.id, email: normalizedEmail, success: false, details: 'Неверный пароль' });
            return res.status(401).json({ message: 'Неверный email или пароль.' });
        }

        await recordLoginAttempt({ userId: user.id, email: normalizedEmail, success: true });

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Ошибка авторизации.' });
    }
});

// Отдача статических файлов из папки public (если она есть)
app.use(express.static(path.join(__dirname, 'public')));

// Обработка корневого пути


// Для SPA - отдача index.html на все прочие пути
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(PORT, () => {
    console.log(`TechStore backend listening on port ${PORT}`);
});

