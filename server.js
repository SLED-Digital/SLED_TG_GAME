import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import cors from 'cors';
import { readFile, writeFile } from 'fs/promises';
import { readFileSync } from 'fs';
import https from 'https';

// Получение __filename и __dirname в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8101;

// SSL-настройки с чтением сертификатов напрямую из Let's Encrypt
const sslOptions = {
  key: readFileSync("/etc/letsencrypt/live/server.sledd.ru/privkey.pem"),
  cert: readFileSync("/etc/letsencrypt/live/server.sledd.ru/fullchain.pem"),
};

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Путь к файлу с пользователями
const USERS_FILE = path.join(__dirname, 'users.json');

// Загрузка пользователей из файла
const loadUsers = async () => {
  try {
    const data = await readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await saveUsers([]);
      return [];
    }
    throw error;
  }
};

// Сохранение пользователей в файл
const saveUsers = async (users) => {
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2));
};

// Добавление нового пользователя
const addUser = async (telegramId) => {
  const users = await loadUsers();
  const user = {
    telegramId,
    points: 0,
    energy: 500,
    inviteCode: telegramId.toString(),
    activatedInviteCodes: [],
  };
  users.push(user);
  await saveUsers(users);
  return user;
};

// Получение пользователя по telegramId
const getUser = async (telegramId) => {
  const users = await loadUsers();
  return users.find(user => user.telegramId === telegramId);
};

// Активация инвайт-кода
const activateInviteCode = async (inviteCode, telegramId) => {
  const users = await loadUsers();
  const user = users.find(u => u.telegramId === telegramId);
  const inviter = users.find(u => u.inviteCode === inviteCode);

  if (!user || !inviter || user.activatedInviteCodes.includes(inviteCode)) {
    throw new Error('Invalid invite code, user not found, or already activated');
  }

  const bonusPoints = 100;
  inviter.points += bonusPoints;
  user.points += bonusPoints;
  user.activatedInviteCodes.push(inviteCode);

  await saveUsers(users);
};

// API-маршруты
app.post('/api/activate-invite', async (req, res) => {
  const { inviteCode, telegramId } = req.body;

  if (!inviteCode || !telegramId) {
    return res.status(400).json({ error: 'Invite code and telegram ID are required' });
  }

  try {
    await activateInviteCode(inviteCode, telegramId);
    res.json({ message: 'Invite code activated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/records/chat/:telegramId/balance/adjust', async (req, res) => {
  const { telegramId } = req.params;
  const { amount, energy } = req.body;

  if (!telegramId || typeof amount !== 'number' || typeof energy !== 'number') {
    return res.status(400).json({ error: 'Telegram ID, amount, and energy are required' });
  }

  try {
    const users = await loadUsers();
    const user = users.find(u => u.telegramId === parseInt(telegramId, 10));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.points = Math.max(0, user.points + amount);
    user.energy = Math.max(0, energy);
    await saveUsers(users);

    res.json({ message: 'Balance adjusted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/user/check', async (req, res) => {
  const { telegramId } = req.body;

  if (!telegramId) {
    return res.status(400).json({ error: 'Telegram ID is required' });
  }

  try {
    let user = await getUser(telegramId);
    if (!user) {
      user = await addUser(telegramId);
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Раздача статических файлов
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Запуск HTTPS сервера
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`🚀 Server running at https://server.sledd.ru:${PORT}`);
});
