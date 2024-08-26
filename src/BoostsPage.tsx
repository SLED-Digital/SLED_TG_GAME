import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {bear, coin, rocket} from "./images";

const BoostPage = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  // const [telegramId, setTelegramId] = useState(''); // Telegram ID пользователя
  // const storedTelegramId = localStorage.getItem('telegramId'); // Сохраняем Telegram ID из localStorage
  const navigate = useNavigate();




      useEffect(() => {
    // Загружаем список задач при монтировании компонента
    fetchTasks();
    const subscriptionStatus = localStorage.getItem('isSubscribed') === 'true';
    setIsSubscribed(subscriptionStatus);
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
      toast.error('Не удалось загрузить задачи.');
    }
  };

  const handleSubscription = async () => {
    try {
      // Здесь предполагается, что у вас есть API для управления подпиской
      const response = await axios.post('/api/subscribe');
      if (response.data.success) {
        toast.success('Вы успешно подписались на Telegram-канал!');
        setIsSubscribed(true);
        localStorage.setItem('isSubscribed', 'true');
      }
    } catch (error) {
      console.error('Ошибка подписки на Telegram-канал:', error);
      toast.error('Ошибка подписки на Telegram-канал.');
    }
  };

  const handleClaimReward = async (taskId) => {
    if (!isSubscribed) {
      toast.error('Сначала необходимо подписаться на канал Telegram!');
      return;
    }

    try {
      const response = await axios.post(`/api/claim-reward`, { taskId });
      if (response.data.success) {
        toast.success('Награда успешно получена!');
        fetchTasks(); // перезагружаем задачи чтобы обновить статусы
      } else {
        toast.error('Ошибка получения награды.');
      }
    } catch (error) {
      console.error('Ошибка получения награды:', error);
      toast.error('Ошибка получения награды.');
    }
  };

    const handleButtonClick = (path: string) => {
    // Навигация по указанному пути
    navigate(`${path}?telegramId=${telegramId}`);
    };

  return (
    <div className="frens-container">
      <div className="absolute bottom-0 w-full px-3 pb-3 z-22 navigatblock">
        <div className="w-full flex justify-between gap-2 navigat">
          <div className="flex-grow flex items-center max-w-80 text-sm">
            <div className="w-full bg-[#249D8C] py-4 rounded-2xl flex justify-around">
              <button className="flex flex-col items-center gap-1" onClick={() => handleButtonClick('/frens')}>
                <img src={bear} width={24} height={24} alt="Frens" />
              </button>
              <button className="flex flex-col items-center gap-1" onClick={() => handleButtonClick('/')}>
                <img src={coin} width={24} height={24} alt="Home" />
              </button>
              <button className="flex flex-col items-center gap-1" onClick={() => handleButtonClick('/boosts')}>
                <img src={rocket} width={24} height={24} alt="Boosts" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// export default Tasks;

export default BoostPage;