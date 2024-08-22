import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Получение __dirname в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Обслуживание статических файлов из папки dist
app.use(express.static(path.join(__dirname, 'dist')));

// Для всех запросов отправляем index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
