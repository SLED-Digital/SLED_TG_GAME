async function getUserDataByTelegramId(telegramId) {
    try {
        const response = await fetch(`https://sled-gameapi-sled.amvera.io/api/records/chat/${telegramId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${"kondrateVVV1987"}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}

// Пример использования функции
const telegramId = 1205880415; // Замените на реальный Telegram ID
getUserDataByTelegramId(telegramId)
    .then(data => {
        console.log('User data:', data);
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });