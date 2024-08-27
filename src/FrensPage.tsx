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
      <div className="absolute top-0  flex items-center justify-center frens-top">
        <p className="text-5xl font-bold text-center">Пригласи <br /> друзей</p>
      </div>

      <div className="absolute w-full frens-middle flex flex-col items-center justify-center bg-[#279E8B] rounded-3xl p-4">
        <div className="flex items-center">
          <img src={coin} width={50} height={50} className="mr-5 mb-3" />
          <p className="text-2xl font-semibold mb-4 font-montserrat">
            Ты и твой друг <br /> получат СЛЕДики
          </p>
        </div>
        <button
          className="invite-text mt-6 mb-2 bg-white text-black font-bold rounded-3xl flex items-center justify-center text-lg font-montserrat"
          onClick={handleShareToTelegram}
        >
          <img src={coin} width={20} height={20} className="mr-2" />
          Пригласить друга
        </button>

        <p className="text-lg mt-2 font-montserrat text-black">
          +50 следов за друга
        </p>

        {!isUserCodeActivated && (
          <div className="active-code-block flex items-center mt-4">
            <input
              type="text"
              value={inputInviteCode}
              onChange={(e) => setInputInviteCode(e.target.value)}
              placeholder="код"
              className="w-full px-10 py-4 border rounded-l-3xl text-black h-12"
            />
            <button
              className="ml-2  flex items-center justify-center bg-white text-black text-lg font-montserrat font-bold px-8 py-4 rounded-r-3xl h-12"
              onClick={handleActivateInviteCode}
            >
              Активировать
            </button>
          </div>
        )}

        <p className="text-lg mt-2 font-montserrat text-black">
          напиши код и получи +50 следов
        </p>
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