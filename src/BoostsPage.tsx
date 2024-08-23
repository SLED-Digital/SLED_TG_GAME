import { useNavigate } from 'react-router-dom';
import { rocket, coin, highVoltage } from './images';

// Массив с информацией о бустах
const boostsData = [
  { id: 1, name: 'Boost 1', cost: 100, effect: 'double_clicks', duration: 60 },
  { id: 2, name: 'Boost 2', cost: 200, effect: 'energy_regen', duration: 120 },
];

// Страница Boost
const BoostPage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    const telegramId = localStorage.getItem('telegramId');
    if (telegramId) {
      navigate(`/?telegramId=${telegramId}`);
    } else {
      navigate('/');
    }
  };

  const handleBoostActivation = (boost: { id?: number; name: any; cost?: number; effect?: string; duration: any; }) => {
    alert(`${boost.name} activated for ${boost.duration} seconds!`);
    // Здесь можно добавить логику для активации буста
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
              <p className="text-lg">Boost Page</p>
            </div>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center">
          <div className="relative mt-6 flex flex-col items-center">
            <img src={rocket} width={256} height={256} alt="rocket" />
            {boostsData.map(boost => (
              <button
                key={boost.id}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={() => handleBoostActivation(boost)}
              >
                Activate {boost.name} for {boost.cost} coins
              </button>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full px-4 pb-4 z-10">
          <div className="w-full flex justify-between gap-2">
            <div className="w-1/3 flex items-center justify-start max-w-32">
              <div className="flex items-center justify-center">
                <img src={highVoltage} width={44} height={44} alt="High Voltage" />
                <div className="ml-2 text-left">
                  <span className="text-white text-2xl font-bold block">600</span>
                  <span className="text-white text-large opacity-75">/ 600</span>
                </div>
              </div>
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
            onClick={handleBackToHome}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoostPage;