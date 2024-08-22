import { useNavigate } from 'react-router-dom';
import { bear, coin, highVoltage, rocket } from './images';
import { FacebookShareButton, TwitterShareButton, TelegramShareButton, VKShareButton } from 'react-share';
import { useState } from 'react';

// Страница Frens
const FrensPage = () => {
  const navigate = useNavigate();
  const [shareUrl, setShareUrl] = useState('');

  const handleBackToHome = () => {
    const telegramId = localStorage.getItem('telegramId');
    if (telegramId) {
      navigate(`/?telegramId=${telegramId}`);
    } else {
      navigate('/');
    }
  };

  const handleInviteToTelegram = () => {
    const telegramId = localStorage.getItem('telegramId');
    if (telegramId) {
      const inviteCode = `invite_code_${telegramId}`;
      const inviteLink = `https://t.me/your_telegram_bot?start=${inviteCode}`;
      window.open(inviteLink, '_blank');
    } else {
      alert('Telegram ID не найден. Пожалуйста, авторизуйтесь снова.');
    }
  };

  const handleGenerateShareLink = () => {
    const telegramId = localStorage.getItem('telegramId');
    if (telegramId) {
      const shareLink = `https://yourdomain.com/share?ref=${telegramId}`;
      setShareUrl(shareLink);
    } else {
      alert('Telegram ID не найден. Пожалуйста, авторизуйтесь снова.');
    }
  };

  return (
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium">
      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white">
        <div className="fixed top-0 left-0 w-full px-4 pt-8 z-10 flex flex-col items-center text-white">
          <div className="w-full cursor-pointer">
            <div className="bg-[#1f1f1f] text-center py-2 rounded-xl">
              <p className="text-lg">Frens Page</p>
            </div>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center">
          <div className="relative mt-4 flex flex-col items-center">
            <img src={bear} width={256} height={256} alt="bear" />
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={handleInviteToTelegram}
            >
              Пригласить в Telegram
            </button>
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
              onClick={handleGenerateShareLink}
            >
              Поделиться уникальной ссылкой
            </button>
            {shareUrl && (
              <div className="mt-4">
                <FacebookShareButton url={shareUrl}>
                  <button className="mr-2 px-4 py-2 bg-blue-600 text-white rounded-lg">Facebook</button>
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl}>
                  <button className="mr-2 px-4 py-2 bg-blue-400 text-white rounded-lg">Twitter</button>
                </TwitterShareButton>
                <TelegramShareButton url={shareUrl}>
                  <button className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-lg">Telegram</button>
                </TelegramShareButton>
                <VKShareButton url={shareUrl}>
                  <button className="px-4 py-2 bg-blue-300 text-white rounded-lg">VK</button>
                </VKShareButton>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full px-4 pb-4 z-10">
          <div className="w-full flex justify-between gap-2">
            <div className="w-1/3 flex items-center justify-start max-w-32">
              <div className="flex items-center justify-center">
                <img src={highVoltage} width={44} height={44} alt="High Voltage" />
                <div className="ml-2 text-left">
                  <span className="text-white text-2xl font-bold block">100</span>
                  <span className="text-white text-large opacity-75">/ 6500</span>
                </div>
              </div>
            </div>
            <div className="flex-grow flex items-center max-w-60 text-sm">
              <div className="w-full bg-[#fad258] py-4 rounded-2xl flex justify-around">
                <button className="flex flex-col items-center gap-1" onClick={() => navigate('/earn')}>
                  <img src={coin} width={24} height={24} alt="Earn" />
                  <span>Earn</span>
                </button>
                <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
                <button className="flex flex-col items-center gap-1" onClick={() => navigate('/boosts')}>
                  <img src={rocket} width={24} height={24} alt="Boosts" />
                  <span>Boosts</span>
                </button>
              </div>
            </div>
          </div>
          <button
            className="w-full mt-4 py-2 bg-blue-500 text-white rounded-xl"
            onClick={handleBackToHome}
          >
            Назад на главную
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrensPage;
