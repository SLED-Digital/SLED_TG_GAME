import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

// Получение __dirname в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8080;

// Использование bodyParser для парсинга JSON-запросов
app.use(bodyParser.json());

// Обслуживание статических файлов из папки dist
app.use(express.static(path.join(__dirname, 'dist')));

// Хранение данных о пользователях
let users = [];

// Маршрут для проверки существования пользователя
app.get('/api/users/:telegramId', (req, res) => {
  const { telegramId } = req.params;
  const user = users.find(user => user.telegramId === telegramId);
  res.json(user || null);
});

// Маршрут для создания нового пользователя с проверкой инвайт-кода
app.post('/api/users', (req, res) => {
  const { inviteCode, telegramId } = req.body;

  // Проверка, существует ли уже такой пользователь
  if (users.some(user => user.telegramId === telegramId)) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  // Проверка, существует ли инвайт-код
  const inviter = users.find(user => user.telegramId === inviteCode);
  if (!inviter) {
    return res.status(400).json({ message: 'Invalid invite code.' });
  }

  // Добавление нового пользователя
  users.push({ telegramId, points: 0, energy: 2532, minedCurrency: 0, miners: 0 });

  // Начисление награды пригласившему пользователю
  inviter.points += 1000; // Пример награды

  res.json({ message: 'User registered successfully. Inviter rewarded.' });
});

// Для всех запросов отправляем index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});