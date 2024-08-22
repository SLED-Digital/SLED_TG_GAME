import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Arrow from './icons/Arrow';
import { coin, miner, brokenMiner, rocket } from './images';

// Массив с информацией о майнерах
const minersData = [
  { id: 1, name: 'Майнер 1', cost: 100, image: miner },
  { id: 2, name: 'Майнер 2', cost: 200, image: miner },
  { id: 3, name: 'Майнер 3', cost: 300, image: miner },
  { id: 4, name: 'Майнер 4', cost: 400, image: miner },
];

// Страница Earn
const Earn = () => {
  const [points, setPoints] = useState(0);
  const [miners, setMiners] = useState(0);
  const [maintenanceTimer, setMaintenanceTimer] = useState(600); // Таймер обслуживания в секундах (10 минут)
  const [degradation, setDegradation] = useState(0); // Уровень деградации майнера
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      if (miners > 0 && maintenanceTimer > 0) {
        const newPoints = points + miners;
        setPoints(newPoints);
        const newDegradation = degradation + 1;
        setDegradation(newDegradation);
        const newMaintenanceTimer = maintenanceTimer - 1;
        setMaintenanceTimer(newMaintenanceTimer);
        updateUserInLocalStorage(newPoints, miners, newMaintenanceTimer, newDegradation);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [miners, points, maintenanceTimer, degradation]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const telegramId = Number(searchParams.get('telegramId'));
    if (telegramId) {
      const user = checkUserExists(telegramId);

      if (user) {
        setIsAuthenticated(true);
        setPoints(user.points);
        setMiners(user.miners);
        setMaintenanceTimer(user.maintenanceTimer || 600);
        setDegradation(user.degradation || 0);
        localStorage.setItem('telegramId', String(telegramId));
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  const checkUserExists = (telegramId: number) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find((user: { telegramId: number; }) => user.telegramId === telegramId);
  };

  const updateUserInLocalStorage = (newPoints: number, newMiners: number, newMaintenanceTimer: number, newDegradation: number) => {
    const telegramId = Number(localStorage.getItem('telegramId'));
    if (telegramId) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((user: { telegramId: number; }) => user.telegramId === telegramId);
      if (userIndex !== -1) {
        users[userIndex].points = newPoints;
        users[userIndex].miners = newMiners;
        users[userIndex].maintenanceTimer = newMaintenanceTimer;
        users[userIndex].degradation = newDegradation;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  const handleMaintainMiner = () => {
    const maintenanceCost = 50;
    if (points >= maintenanceCost) {
      const newPoints = points - maintenanceCost;
      const newMaintenanceTimer = 600;
      const newDegradation = 0;
      setPoints(newPoints);
      setMaintenanceTimer(newMaintenanceTimer);
      setDegradation(newDegradation);
      updateUserInLocalStorage(newPoints, miners, newMaintenanceTimer, newDegradation);
    }
  };

  const handleBuyMiner = (cost: number) => {
    if (points >= cost) {
      const newPoints = points - cost;
      const newMiners = miners + 1;
      setPoints(newPoints);
      setMiners(newMiners);
      updateUserInLocalStorage(newPoints, newMiners, maintenanceTimer, degradation);
    }
  };

  if (!isAuthenticated) {
    return <div>Загрузка...</div>;
  }

  const handleHomeClick = () => {
    const searchParams = new URLSearchParams(location.search);
    const telegramId = searchParams.get('telegramId');
    navigate(`/?telegramId=${telegramId}`);
  };

  const maintenancePercentage = ((maintenanceTimer / 600) * 100).toFixed(0);
  const degradationPercentage = ((degradation / 600) * 100).toFixed(0);

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
              <p className="text-lg">Зарабатывай <Arrow size={18} className="ml-0 mb-1 inline-block" /></p>
            </div>
          </div>
          <div className="mt-12 text-5xl font-bold flex items-center">
            <img src={coin} width={44} height={44} alt="Coin" />
            <span className="ml-2">{points.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center">
          <div className="relative mt-4 bg-[#1f1f1f] p-4 rounded-lg cursor-pointer" onClick={handleMaintainMiner}>
            <img src={degradation >= 600 ? brokenMiner : miner} width={256} height={256} alt="Miner" />
            <div className="absolute text-5xl font-bold" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.9 }}>
              {miners} Майнеров
            </div>
            <div className="absolute bottom-0 left-0 w-full p-2">
              <div className="w-full bg-gray-400 rounded-full">
                <div className="bg-yellow-500 h-4 rounded-full transition-all duration-1000" style={{ width: `${maintenancePercentage}%` }}></div>
              </div>
              <div className="text-center mt-1 text-sm">{maintenancePercentage}%</div>
              <div className="w-full bg-gray-400 rounded-full mt-2">
                <div className="bg-red-500 h-4 rounded-full transition-all duration-1000" style={{ width: `${degradationPercentage}%` }}></div>
              </div>
              <div className="text-center mt-1 text-sm">{degradationPercentage}%</div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full px-4 pb-4 z-10">
          <div className="w-full flex justify-between gap-2">
            <div className="w-1/3 flex items-center justify-start max-w-32">
              <button
                className="w-full py-2 bg-green-500 text-white rounded-xl"
                onClick={() => handleBuyMiner(minersData[0].cost)}
              >
                Купить Майнер за {minersData[0].cost} монет
              </button>
            </div>
            <div className="flex-grow flex items-center max-w-60 text-sm">
              <div className="w-full bg-[#fad258] py-4 rounded-2xl flex justify-around">
                <button className="flex flex-col items-center gap-1" onClick={() => navigate('/frens')}>
                  <img src={coin} width={24} height={24} alt="Frens" />
                  <span>Frens</span>
                </button>
                <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
                <button className="flex flex-col items-center gap-1" onClick={() => navigate('/boosts')}>
                  <img src={rocket} width={24} height={24} alt="Boosts" />
                  <span>Бусты</span>
                </button>
              </div>
            </div>
          </div>
          <button
            className="w-full mt-4 py-2 bg-blue-500 text-white rounded-xl"
            onClick={handleHomeClick}
          >
            Домой
          </button>
        </div>
      </div>
    </div>
  );
};

export default Earn;