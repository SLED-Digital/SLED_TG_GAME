import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { bear, coin, rocket } from './images';
import { toast } from 'react-toastify';
import axios from 'axios';

const Frens = () => {
  const [inviteLink, setInviteLink] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const inviteCode = searchParams.get('invite');
    const telegramId = localStorage.getItem('telegramId');

    if (inviteCode && telegramId) {
      // Отправка запроса на сервер для начисления награды за приглашение
      axios.post('/api/invite', { inviteCode, telegramId })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // .then(response => {
        //   toast.success('You joined via invite link! The inviter will receive a reward.');
        // })
        .catch(error => {
          console.error('Error joining via invite link:', error);
          toast.error('Error joining via invite link.');
        });
    }

    // Генерация уникальной инвайт-ссылки для текущего игрока
    if (telegramId) {
      const uniqueInviteLink = `${window.location.origin}/frens?invite=${telegramId}`;
      setInviteLink(uniqueInviteLink);
    }
  }, [location]);

  const handleShareToMessenger = (platform: string) => {
    if (!inviteLink) {
      toast.error('Invite link is not set.');
      return;
    }

    let shareUrl = '';
    switch (platform) {
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(inviteLink)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}`;
        break;
      default:
        toast.error('Unsupported platform.');
        return;
    }

    window.open(shareUrl, '_blank');
  };

  const handleButtonClick = (path: string) => {
    const telegramId = localStorage.getItem('telegramId');
    navigate(`${path}?telegramId=${telegramId}`);
  };

  return (
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium">
      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute top background-kashtan flex flex-col items-center justify-center">
        <div className="mt-12 text-5xl font-bold flex items-center margintext-top">
          <img src={bear} width={39} height={44} />
          <span className="ml-2 txt-size">Frens</span>
        </div>
      </div>
      <div className="absolute top background-purple"></div>

      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white">
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            {/*<input*/}
            {/*  type="text"*/}
            {/*  className="w-full p-2 rounded-lg bg-gray-800 text-white"*/}
            {/*  placeholder="Your invite link"*/}
            {/*  value={inviteLink}*/}
            {/*  readOnly*/}
            {/*/>*/}
            <button
              className="w-full p-2 rounded-lg bg-blue-500 text-white"
              onClick={() => handleShareToMessenger('telegram')}
            >
              Share to Telegram
            </button>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full px-3 pb-3 z-22 navigatblock">
          <div className="w-full flex justify-between gap-2 navigat">
            <div className="flex-grow flex items-center max-w-80 text-sm">
              <div className="w-full bg-[#249D8C] py-4 rounded-2xl flex justify-around">
                <button className="flex flex-col items-center gap-1" onClick={() => handleButtonClick('/earn')}>
                  <img src={coin} width={24} height={24} alt="Earn" />
                </button>
                <button className="flex flex-col items-center gap-1" onClick={() => handleButtonClick('/frens')}>
                  <img src={bear} width={24} height={24} alt="Frens" />
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