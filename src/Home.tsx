import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { bear, coin, highVoltage, notcoin, rocket } from './images';

const Home = () => {
  const [points, setPoints] = useState(0);
  const [energy, setEnergy] = useState(2532);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pointsToAdd = 12;
  const energyToReduce = 12;
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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

    setClicks([...clicks, { id: Date.now(), x, y }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newEnergy = Math.min(energy + 1, 500);
      setEnergy(newEnergy);
      updateUserInLocalStorage(points, newEnergy);
    }, 100);

    return () => clearInterval(interval);
  }, [energy, points]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const telegramId = Number(searchParams.get('telegramId'));

    if (telegramId) {
      let user = checkUserExists(telegramId);

      if (!user) {
        addUser(telegramId);
        user = checkUserExists(telegramId);
      }

      if (user) {
        setIsAuthenticated(true);
        setPoints(user.points);
        setEnergy(user.energy);
        localStorage.setItem('telegramId', String(telegramId));
      } else {
        console.error('Failed to authenticate user');
      }
    } else {
      navigate('/login'); // Перенаправьте на страницу входа, если параметр не найден
    }
  }, [location, navigate]);

  const checkUserExists = (telegramId: number) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find((user: { telegramId: number }) => user.telegramId === telegramId);
  };

  const addUser = (telegramId: number) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({ telegramId, points: 0, energy: 2532, minedCurrency: 0, miners: 0 });
    localStorage.setItem('users', JSON.stringify(users));
  };

  const updateUserInLocalStorage = (newPoints: number, newEnergy: number) => {
    const telegramId = Number(localStorage.getItem('telegramId'));
    if (telegramId) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((user: { telegramId: number }) => user.telegramId === telegramId);
      if (userIndex !== -1) {
        users[userIndex].points = newPoints;
        users[userIndex].energy = newEnergy;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  const handleButtonClick = (path: string) => {
    const telegramId = localStorage.getItem('telegramId');
    navigate(`${path}?telegramId=${telegramId}`);
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>; // Или другая заглушка на время проверки авторизации
  }

  const getEnergyColor = () => {
    const percentage = (energy / 500) * 100;
    if (percentage > 66) {
      return '#fad258'; // Жёлтый (по умолчанию)
    } else if (percentage > 33) {
      return '#f9a258'; // Оранжевый
    } else {
      return '#f95758'; // Красный
    }
  };

  return (
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium">
      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute top background-kashtan flex flex-col items-center justify-center">

        <div className="mt-12 text-5xl font-bold flex items-center margintext-top">
            <img src={coin} width={39} height={44} />
            <span className="ml-2 txt-size">{points.toLocaleString()}</span>
        </div>

        <div className="absolute bottom-0 w-full flex justify-center items-center pb-4">
            <div className="buttonvivod-button"><p>вывести</p></div>
          </div>
      </div>
      <div className="absolute top background-purple"></div>

      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white">
        <div className="fixed top-0 left-0 w-full px-4 pt-8 z-10 flex flex-col items-center text-white toolbar">
          <div className="w-full flex justify-center items-center gap-2 mt-4">
            <div className="block-energy">
              <img src={highVoltage} width={44} height={44} alt="High Voltage" />
            </div>
            <div className="w-full bg-[#f9c035] rounded-full mt-2 border-energy">
              <div
                className="h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${(energy / 500) * 100}%`,
                  backgroundColor: getEnergyColor(),
                }}
              ></div>
            </div>
          </div>
          <div className="w-1/3 flex items-center justify-start max-w-32">
            <div className="flex items-center justify-center">
              <div className="ml-2 text-left farmer-number">
                <span className="text-white text-2xl font-bold block textcolor-black">{energy}</span>
                <span className="text-white text-large opacity-75 textcolor-black">/ 500</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center notcoin-block relative">
          <div className="relative mt-4 notc-block" onClick={handleClick}>
            <img src={notcoin} width={768} height={768} alt="notcoin" className="notc-width" />
            {clicks.map((click) => (
              <div
                key={click.id}
                className="absolute text-5xl font-bold opacity-0"
                style={{
                  top: `${click.y - 126}px`, // 42px * 3
                  left: `${click.x - 84}px`, // 28px * 3
                  animation: `float 1s ease-out`
                }}
                onAnimationEnd={() => handleAnimationEnd(click.id)}
              >
                10
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full px-8 pb-8 z-22 navigatblock">
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

export default Home;