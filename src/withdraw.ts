// withdraw.ts

import axios from "axios";

export const handleWithdrawBalance = async (telegramId: number, points: number) => {
    // Создание запроса к API для вывода средств
    const FLASK_API_URL = `http://192.168.0.65:5000/api/records`;
    const token = 'kondrateVVV1987'; // Убедитесь, что это правильный токен

    
    try {
      axios.put(`${FLASK_API_URL}/chat/${telegramId}/balance/adjust`, { amount: points }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      // Обнуление баланса в локальном хранилище
      updateUserBalanceInLocalStorage(telegramId, 0);
  
    } catch (error) {
      console.error('Error adjusting user balance:', error);
    }
  };
  
  const updateUserBalanceInLocalStorage = (telegramId: number, newPoints: number) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((user: { telegramId: number }) => user.telegramId === telegramId);
    if (userIndex !== -1) {
      users[userIndex].points = newPoints;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };