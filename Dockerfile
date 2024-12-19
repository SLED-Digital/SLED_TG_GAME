FROM node:22

# Установка рабочей директории
WORKDIR /app

# Копирование зависимостей
COPY package*.json ./

# Установка зависимостей Node.js
RUN npm install --production

# Копирование остальных файлов приложения
COPY . .

# Сборка проекта
RUN npm install
RUN npm run build

# Открытие порта
EXPOSE 8101

# Команда запуска
CMD ["node", "server.js"]