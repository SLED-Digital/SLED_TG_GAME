import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { bear, coin, rocket } from './images';
import { toast } from 'react-toastify';
import axios, { AxiosError } from 'axios';

const Frens = () => {
  const [, setInviteLink] = useState(''); // Ссылка для инвайта
  const [telegramId, setTelegramId] = useState(''); // Telegram ID пользователя
  const [inputInviteCode, setInputInviteCode] = useState(''); // Введенный инвайт-код
  const [isUserCodeActivated, setIsUserCodeActivated] = useState(false); // Флаг активации кода для конкретного пользователя

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initialize = async () => {
      const searchParams = new URLSearchParams(location.search);
      const inviteCode = searchParams.get('invite'); // Получаем инвайт-код из URL
      const storedTelegramId = localStorage.getItem('telegramId'); // Сохраняем Telegram ID из localStorage
      const activatedCodes = JSON.parse(localStorage.getItem('activatedCodes') || '{}'); // Получаем активированные инвайт-коды

      if (storedTelegramId) {
        // Если storedTelegramId существует, генерируем уникальную инвайт-ссылку
        const uniqueInviteLink = `${window.location.origin}/frens?invite=${storedTelegramId}`;
        setInviteLink(uniqueInviteLink);
        setTelegramId(storedTelegramId);

        // Проверяем, активирован ли код конкретным пользователем
        setIsUserCodeActivated(activatedCodes[storedTelegramId] === true);
      }

      if (inviteCode && storedTelegramId && !activatedCodes[storedTelegramId]) {
        try {
          // Если у нас есть inviteCode и storedTelegramId, отправляем запрос на сервер для активации по инвайт-ссылке
          await axios.post('/api/activate-invite', { inviteCode, telegramId: storedTelegramId });
          toast.success('Инвайт-код успешно активирован! Вам и автору кода начислены бонусы.');
          activatedCodes[storedTelegramId] = true;
          localStorage.setItem('activatedCodes', JSON.stringify(activatedCodes)); // Обновляем активированные коды
          setIsUserCodeActivated(true);
        } catch (error) {
          const axiosError = error as AxiosError;
          console.error('Ошибка активации инвайт-кода:', axiosError);
          toast.error('Ошибка активации инвайт-кода.');
        }
      }
    };

    initialize();
  }, [location]);

  const handleShareToTelegram = () => {
    if (!telegramId) {
      // Если нет Telegram ID, показываем ошибку
      toast.error('Инвайт ссылка не установлена.');
      return;
    }

    // Формируем сообщение для инвайта
    const inviteMessage = `Привет! Приглашаю тебя присоединиться к нашей увлекательной игре. Используй мой инвайт-код: ${telegramId}. Присоединяйся и получай бонусы!`;
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteMessage)}`;
    window.open(shareUrl, '_blank'); // Открываем Telegram для отправки сообщения
  };

  const handleActivateInviteCode = async () => {
    if (isUserCodeActivated) {
      // Если код уже активирован, показываем ошибку
      toast.error('Вы уже активировали инвайт-код.');
      return;
    }

    if (!inputInviteCode) {
      // Если инвайт-код не введен, показываем ошибку
      toast.error('Пожалуйста, введите инвайт-код.');
      return;
    }

    try {
      await axios.post('/api/activate-invite', { inviteCode: inputInviteCode, telegramId });
      toast.success('Инвайт-код успешно активирован! Вам и автору кода начислены бонусы.');
      const activatedCodes = JSON.parse(localStorage.getItem('activatedCodes') || '{}');
      activatedCodes[telegramId] = true;
      localStorage.setItem('activatedCodes', JSON.stringify(activatedCodes)); // Обновляем активированные коды
      setIsUserCodeActivated(true);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Ошибка активации инвайт-кода:', axiosError);
      toast.error('Ошибка активации инвайт-кода.');
    }
  };

  const handleButtonClick = (path: string) => {
    // Навигация по указанному пути
    navigate(`${path}?telegramId=${telegramId}`);
  };

  return (
    <div className="frens-container">
      <div className="absolute top-0 w-full h-20 flex items-center justify-center frens-top bg-yellow-500">
        <p className="text-2xl font-bold">Пригласи друзей</p>
      </div>

      <div className="absolute top-1/4 w-full h-1/2 frens-middle flex flex-col items-center justify-center bg-green-500 rounded-3xl p-4">
        <p className="text-lg font-semibold mb-4">
          Используй инвайт-код ниже:
        </p>
        <div className="bg-white text-black px-4 py-2 rounded-lg mb-4">
          {telegramId}
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2 flex items-center justify-center"
          onClick={handleShareToTelegram}
        >
          Поделиться в Telegram
        </button>
        {!isUserCodeActivated && (
          <div className="flex flex-col items-center mt-4">
            <input
              type="text"
              value={inputInviteCode}
              onChange={(e) => setInputInviteCode(e.target.value)}
              placeholder="Введите инвайт-код"
              className="w-full px-4 py-2 mb-2 border rounded-lg text-black"
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={handleActivateInviteCode}
            >
              Активировать инвайт-код
            </button>
          </div>
        )}
      </div>

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

export default Frens;