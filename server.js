import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs/promises'; // Для работы с файловой системой

// Получение __filename и __dirname в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

const USERS_FILE = path.join(__dirname, 'users.json');

// Загрузка пользователей из JSON
const loadUsers = async () => {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading users:', error);
    if (error.code === 'ENOENT') {
      // Если файл не существует, создаем его с пустым массивом пользователей
      await saveUsers([]);
      return [];
    } else {
      throw new Error('Failed to load users');
    }
  }
};

// Сохранение пользователей в JSON
const saveUsers = async (users) => {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
    throw new Error('Failed to save users');
  }
};

// Добавление нового пользователя
const addUser = async (telegramId) => {
  const users = await loadUsers();
  const user = {
    telegramId,
    points: 0,
    energy: 500,
    inviteCode: telegramId,
    activatedInviteCodes: []
  };
  users.push(user);
  await saveUsers(users);
  return user;
};

// Проверка наличия пользователя
const getUser = async (telegramId) => {
  const users = await loadUsers();
  return users.find((user) => user.telegramId === telegramId);
};

// Начисление бонусов за активацию инвайт-кода
const activateInviteCode = async (inviteCode, telegramId) => {
  const users = await loadUsers();
  const user = users.find((u) => u.telegramId === telegramId);
  const inviter = users.find((u) => u.inviteCode === inviteCode);

  if (!user || !inviter || user.activatedInviteCodes.includes(inviteCode)) {
    throw new Error('Invalid invite code or user or code already activated');
  }

  // Начисление бонусов
  const bonusPoints = 100; // бонусные баллы за активацию инвайт-кода
  inviter.points += bonusPoints;
  user.points += bonusPoints;

  // Добавление кода в список активированных
  user.activatedInviteCodes.push(inviteCode);

  await saveUsers(users);
};

// Endpoint для активации инвайт-кода
app.post('/api/activate-invite', async (req, res) => {
  const { inviteCode, telegramId } = req.body;

  if (!inviteCode || !telegramId) {
    return res.status(400).json({ error: 'Invite code and telegram ID are required' });
  }

  try {
    await activateInviteCode(inviteCode, telegramId);
    res.status(200).json({ message: 'Invite code activated successfully' });
  } catch (error) {
    console.error('Error activating invite code:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint для коррекции баланса пользователя
app.put('/api/records/chat/:telegramId/balance/adjust', async (req, res) => {
  const { telegramId } = req.params;
  const { amount } = req.body;

  if (!telegramId || !amount) {
    return res.status(400).json({ error: 'Telegram ID and amount are required' });
  }

  try {
    // Загрузка пользователей из JSON
    const users = await loadUsers();
    const user = users.find((u) => u.telegramId === telegramId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Коррекция баланса
    user.points = Math.max(0, user.points + amount);

    // Сохранение изменений
    await saveUsers(users);

    res.status(200).json({ message: 'Balance adjusted successfully' });
  } catch (error) {
    console.error('Error adjusting user balance:', error);
    res.status(500).json({ error: 'Error adjusting user balance' });
  }
});

// Endpoint для проверки и добавления пользователя при первом входе
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

    res.status(200).json({ message: 'User checked successfully', user });
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Обслуживание статических файлов (React приложения)
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});