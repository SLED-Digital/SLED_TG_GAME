import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { bear, coin, rocket } from './images';
import { toast } from 'react-toastify';
import axios from 'axios';

const Frens = () => {
  const [inviteLink, setInviteLink] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [inputInviteCode, setInputInviteCode] = useState('');
  const [isCodeActivated, setIsCodeActivated] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const inviteCode = searchParams.get('invite');
    const storedTelegramId = localStorage.getItem('telegramId');
    const isCodeActivated = localStorage.getItem('isCodeActivated') === 'true';

    setIsCodeActivated(isCodeActivated);

    if (inviteCode && storedTelegramId) {
      axios.post('/api/invite', { inviteCode, telegramId: storedTelegramId })
        .catch(error => {
          console.error('Ошибка присоединения по инвайт-ссылке:', error);
          toast.error('Ошибка присоединения по инвайт-ссылке.');
        });
    }

    if (storedTelegramId) {
      const uniqueInviteLink = `${window.location.origin}/frens?invite=${storedTelegramId}`;
      setInviteLink(uniqueInviteLink);
      setTelegramId(storedTelegramId);
    }
  }, [location]);

  const handleShareToTelegram = () => {
    if (!telegramId) {
      toast.error('Инвайт ссылка не установлена.');
      return;
    }

    const inviteMessage = `Привет! Приглашаю тебя присоединиться к нашей увлекательной игре. Используй мой инвайт-код: ${telegramId}. Присоединяйся и получай бонусы!`;
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteMessage)}`;
    window.open(shareUrl, '_blank');
  };

  const handleActivateInviteCode = () => {
    if (isCodeActivated) {
      toast.error('Вы уже активировали инвайт-код.');
      return;
    }

    if (!inputInviteCode) {
      toast.error('Пожалуйста, введите инвайт-код.');
      return;
    }

    axios.post('/api/activate-invite', { inviteCode: inputInviteCode, telegramId })
      .then(response => {
        toast.success('Инвайт-код успешно активирован! Вам и автору кода начислены бонусы.');
        setIsCodeActivated(true);
        localStorage.setItem('isCodeActivated', 'true');
      })
      .catch(error => {
        console.error('Ошибка активации инвайт-кода:', error);
        toast.error('Ошибка активации инвайт-кода.');
      });
  };

  const handleButtonClick = (path) => {
    navigate(`${path}?telegramId=${telegramId}`);
  };

  return (
    <div className="frens-container">
      <div className="absolute top-0 w-full h-20 flex items-center justify-center frens-top bg-yellow-500">
        <p className="text-2xl font-bold">Пригласи друзей</p>
      </div>
      <div className="absolute top-1/4 w-full h-1/2 frens-midle flex flex-col items-center justify-center bg-green-500 rounded-3xl p-4">
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
        {!isCodeActivated && (
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

      <div className="absolute top bottom-block">
        <div className="fixed bottom-0 left-0 w-full px-3 pb-3 z-22 navigatblock">
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
    </div>
  );
};

export default Frens;