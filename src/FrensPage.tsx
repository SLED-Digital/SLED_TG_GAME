import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { coin, copy, frens, frens_inv, home, home_inv, task, task_inv } from './images';
import { toast, ToastContainer } from 'react-toastify';
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
      const telegramId = searchParams.get('telegramId');
      const activatedCodes = JSON.parse(localStorage.getItem('activatedCodes') || '{}'); // Получаем активированные инвайт-коды

      if (telegramId) {
        // Если storedTelegramId существует, генерируем уникальную инвайт-ссылку
        const uniqueInviteLink = `${window.location.origin}/frens?invite=${telegramId}`;
        setInviteLink(uniqueInviteLink);
        setTelegramId(telegramId);

        // Проверяем, активирован ли код конкретным пользователем
        setIsUserCodeActivated(activatedCodes[telegramId] === true);
      }

      if (inviteCode && telegramId && !activatedCodes[telegramId]) {
        try {
          // Если у нас есть inviteCode и storedTelegramId, отправляем запрос на сервер для активации по инвайт-ссылке
          await axios.post('/api/activate-invite', { inviteCode, telegramId: telegramId });
          toast.success('Инвайт-код успешно активирован! Вам и автору кода начислены бонусы.');
          activatedCodes[telegramId] = true;
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

  const handleCopyToClipboard = () => {
    const inviteMessage = `Привет! Приглашаю тебя присоединиться к нашей увлекательной игре. Используй мой инвайт-код: ${telegramId}. Присоединяйся и получай бонусы!`;
    navigator.clipboard.writeText(inviteMessage)
      .then(() => {
        toast.success('Cкопировано в буфер обмена.');
      })
      .catch((error) => {
        console.error('Ошибка копирования в буфер обмена:', error);
        toast.error('Не удалось скопировать');
      });
  };

  const handleButtonClick = (path: string) => {
    // Навигация по указанному пути
    navigate(`${path}?telegramId=${telegramId}`);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="frens-container">
      <ToastContainer limit={1} />
      <div className="absolute top-0 w-full h-1/3 flex items-center justify-center bg-[#EDC448] frens-top">
        <p className="text-5xl text-white font-bold text-center mb-20" style={{ lineHeight: '1', letterSpacing: '0.08em' }}>
          Пригласи <br /> друзей
        </p>
      </div>

      <div className="absolute w-full flex flex-col items-center justify-center bg-[#279E8B] rounded-3xl p-4 h-58 frens-middle">
        <div className="top-0 flex items-center h-full">
          <img src={coin} width={50} height={50} className="mr-4" />
          <p className="text-white text-2xl font-semibold">
            Ты и твой друг <br /> получат СЛЕДики
          </p>
        </div>

        <div className="active-code-block flex justify-center items-center w-80 mt-4">
          <button
            className="flex items-center justify-center bg-white text-black font-montserrat font-bold px-6 py-4 rounded-l-3xl h-12"
            onClick={handleCopyToClipboard}
            style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
          >
            <img src={copy} alt="Copy icon" width={25} height={25} className="mr-2" />
          </button>
          <button
            className="ml-2 flex items-center justify-center bg-white w-full text-black text-lg font-montserrat px-2 py-4 rounded-r-3xl h-12 "
            onClick={handleShareToTelegram}
            style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
          >
            Пригласить друга
          </button>
        </div>

        <p className="text-lg mt-2 mb-5 font-montserrat text-[#f95758] font-semibold">
          +50 следов за друга
        </p>

        {!isUserCodeActivated && (
          <div className="active-code-block flex justify-center items-center w-80 mt-4">
            <input
              type="text"
              value={inputInviteCode}
              onChange={(e) => setInputInviteCode(e.target.value)}
              placeholder="код"
              className="w-full px-10 py-4 border rounded-l-3xl text-black h-12"
            />
            <button
              className="ml-2 flex items-center justify-center bg-white text-black text-lg font-montserrat px-4 py-4 rounded-r-3xl h-12"
              onClick={handleActivateInviteCode}
              style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
            >
              Активировать
            </button>
          </div>
        )}

        <p className="text-lg mt-2 mb-5 font-montserrat text-[#f95758] font-semibold">
          +50 следов за активацию кода
        </p>
      </div>

      {/*кнопки навигации*/}
      <div className="absolute top bottom-block">
        <div className="fixed bottom-0 left-0 w-full px-3 pb-3 z-22 navigatblock">
          <div className="w-full flex justify-between gap-2 navigat">
            <div className="flex-grow flex items-center max-w-80 text-sm">
              <div className="w-full bg-[#249D8C] py-4 rounded-2xl flex justify-around">
                <button
                  className={`flex flex-col items-center gap-1 ${isActive('/frens') ? '' : ''}`}
                  onClick={() => handleButtonClick('/frens')}
                >
                  <img src={isActive('/frens') ? frens_inv : frens} width={24} height={24} alt="Frens" />
                </button>

                <div className="w-0.5 h-8 bg-gray-500 mt-2"></div>

                <button
                  className={`flex flex-col items-center gap-1 ${isActive('/') ? '' : ''}`}
                  onClick={() => handleButtonClick('/')}
                >
                  <img src={isActive('/') ? home_inv : home} width={24} height={24} alt="Home" />
                </button>

                <div className="w-0.5 h-8 bg-gray-500 mt-2"></div>

                <button
                  className={`flex flex-col items-center gap-1 ${isActive('/boosts') ? '' : ''}`}
                  onClick={() => handleButtonClick('/boosts')}
                >
                  <img src={isActive('/boosts') ? task_inv : task} width={24} height={24} alt="Boosts" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Frens;