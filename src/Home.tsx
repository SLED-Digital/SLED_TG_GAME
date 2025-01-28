import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { coin, frens, frens_inv, highVoltage, home, home_inv, notcoin, task, task_inv } from './images';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Click {
  id: number;
  x: number;
  y: number;
}

const Home = () => {
  const [points, setPoints] = useState(0);
  const [energy, setEnergy] = useState(500);
  const [clicks, setClicks] = useState<Click[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [telegramId, setTelegramId] = useState<number | null>(null);
  const SECRET_TOKEN = "kondrateVVV1987";
  // const BD_URL = "https://sled-bd-sled.amvera.io";
  // const BD_URL = "https://172.17.0.4:8080";
  const BD_URL = "https://server.sledd.ru:8080";
  const pointsToAdd = 10;
  const energyToReduce = 10;
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const telegramIdFromUrl = searchParams.get('telegramId');

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (energy - energyToReduce < 0) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPoints = points + pointsToAdd;
    const newEnergy = energy - energyToReduce < 0 ? 0 : energy - energyToReduce;

    setPoints(newPoints);
    setEnergy(newEnergy);
    updateUserInLocalStorage(newPoints, newEnergy);

    setClicks((prevClicks) => [...prevClicks, { id: Date.now(), x, y }]);
    setIsClicked(true);

    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  }, [energy, points, energyToReduce, pointsToAdd]);

  const handleAnimationEnd = useCallback((id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEnergy = Math.min(energy + 1, 500);
      setEnergy(newEnergy);
      updateUserInLocalStorage(points, newEnergy);
    }, 100);

    return () => clearInterval(interval);
  }, [energy, points]);

  useEffect(() => {
    const user = Telegram.WebApp.initDataUnsafe.user;
    const telegramIdFromTelegram = user ? user.id : null;
    const telegramIdFromUrlNumber = telegramIdFromUrl ? Number(telegramIdFromUrl) : null;

    const telegramId = telegramIdFromUrlNumber || telegramIdFromTelegram;
    if (telegramId) {
      checkUser(telegramId);
    } else {
      navigate('/login');
    }
  }, [location, navigate, telegramIdFromUrl]);

  useEffect(() => {
    if (telegramId) {
      const storedData = localStorage.getItem(`user_${telegramId}`);
      if (storedData) {
        const { points: storedPoints, energy: storedEnergy } = JSON.parse(storedData);
        setPoints(storedPoints);
        setEnergy(storedEnergy);
      }
    }
  }, [telegramId]);

  const checkUser = async (telegramId: number) => {
    try {
      const response = await axios.get(`${BD_URL}/api/user/check/${telegramId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SECRET_TOKEN}`
        }
      });
      const user = response.data.user;
      if (user) {
        setIsAuthenticated(true);
        setTelegramId(telegramId);

        if (!localStorage.getItem('welcomeShown')) {
          toast.success('Добро пожаловать! Спасибо, что присоединились к нам.');
          localStorage.setItem('welcomeShown', 'true');
        }

        setTimeout(() => {
          if (!localStorage.getItem('inviteCodeShown')) {
            localStorage.setItem('inviteCodeShown', 'true');
          }
        }, 3000);

        // Start sending data to server every minute
        setInterval(sendDataToServer, 60000);
      } else {
        console.error('User not found');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error checking user:', error);
      toast.error('Ошибка при проверке пользователя.');
    }
  };

  const updateUserInLocalStorage = (newPoints: number, newEnergy: number) => {
    if (telegramId) {
      localStorage.setItem(`user_${telegramId}`, JSON.stringify({ points: newPoints, energy: newEnergy }));
    }
  };

  const sendDataToServer = async () => {
    if (telegramId) {
      const userData = JSON.parse(localStorage.getItem(`user_${telegramId}`) || '{}');
      if (userData.points !== undefined && userData.energy !== undefined) {
        try {
          await axios.put(`${BD_URL}/api/records/chat/${telegramId}/adjust`, {
            amount: userData.points - points,
            energy: userData.energy
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SECRET_TOKEN}`
            }
          });
          setPoints(userData.points);
          setEnergy(userData.energy);
        } catch (error) {
          console.error('Error sending data to server:', error);
          toast.error('Ошибка при синхронизации данных с сервером.');
        }
      }
    }
  };

  const handleButtonClick = (path: string) => {
    navigate(`${path}?telegramId=${telegramId}`);
  };

  const getEnergyColor = () => {
    const percentage = (energy / 500) * 100;
    if (percentage > 66) {
      return '#fad258';
    } else if (percentage > 33) {
      return '#f9a258';
    } else {
      return '#f95758';
    }
  };

  const handleWithdrawBalance = async () => {
    setIsButtonPressed(true);

    if (points < 15000) {
      toast.info('Недостаточно средств для вывода. Требуется минимум 15000 баллов.');
      setIsButtonPressed(false);
      return;
    }

    if (telegramId && points > 0) {
      try {
        await axios.put(`${BD_URL}/api/records/chat/${telegramId}/adjust`, {
          amount: ~~(points / 1000)
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SECRET_TOKEN}`
          }
        });
        setPoints(0);

        toast.success('Баланс успешно выведен!');
      } catch (error) {
        console.error('Error adjusting user balance:', error);
        toast.error('Ошибка при выводе баланса.');
      } finally {
        setIsButtonPressed(false);
      }
    } else {
      toast.info('Недостаточно средств для вывода.');
      setIsButtonPressed(false);
    }
  };

  if (!isAuthenticated) {
    return 1;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="home-container">
      <ToastContainer limit={1} />
      <div className="absolute top top-block">
        <div className="block-energy">
          <img src={highVoltage} width={70} height={70} alt="High Voltage" />
        </div>
        <div className="w-full bg-[#F4C84B] rounded-full mt-3 border-energy">
          <div
            className="h-4 rounded-full transition-all duration-500"
            style={{
              width: `${(energy / 500) * 100}%`,
              backgroundColor: getEnergyColor(),
            }}
          ></div>
        </div>
        <div className="ml-2 text-left farmer-number">
          <span className="energe-text text-2xl font-bold block textcolor-black">{energy}</span>
          <span className="energe-text text-large opacity-65 textcolor-black">/  500</span>
        </div>
      </div>

      <div className="absolute top midle-block">
        <div className="notc-block" onPointerDown={handlePointerDown}>
          <img
            src={notcoin}
            alt="notcoin"
            className={`notc-width ${isClicked ? 'click-animation' : ''} `}
            onAnimationEnd={() => setIsClicked(false)}
          />
          {clicks.map((click) => (
            <div
              key={click.id}
              className="absolute text-5xl font-bold opacity-0"
              style={{
                top: `${click.y - 21}px`,
                left: `${click.x - 14}px`,
                animation: `float 1s ease-out`
              }}
              onAnimationEnd={() => handleAnimationEnd(click.id)}
            >
              <img
                src={notcoin}
                width={56 * 0.8}
                height={56 * 0.8}
                alt="Coin"
                style={{ filter: 'invert(18%) sepia(91%) saturate(5678%) hue-rotate(8deg) brightness(93%) contrast(101%)' }}
              />
            </div>
          ))}
        </div>

        <button
          className={`buttonvivod-button ${isButtonPressed ? 'pressed' : ''}`}
          onClick={handleWithdrawBalance}
          style={{ boxShadow: '0 4px 8px rgba(10, 10, 10, 0.5)' }}
        >
          Вывести
        </button>

        <div className="mt-14 text-2xl font-bold flex items-center balance-block">
          <img src={coin} width={44} height={44} />
          <span className="ml-4 txt-size flex justify-center items-center text-4xl">{points.toLocaleString()}</span>
        </div>
      </div>

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

export default Home;
