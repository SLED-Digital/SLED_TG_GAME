var telegramId = 1205880415; // Замените на нужный telegram_id
var token = "kondrateVVV1987"; // Замените на ваш токен

var data = {
    amount: 100 // Замените на нужную сумму
};

fetch(`https://sled-gameapi-sled.amvera.io/api/records/chat/${telegramId}/balance/adjust`, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => {
    console.log("Успешный ответ:", data);
})
.catch(error => {
    console.error("Ошибка:", error);
});