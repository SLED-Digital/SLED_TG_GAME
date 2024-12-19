import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  boost,
  frens,
  frens_inv,
  home,
  home_inv,
  rutube, sled,
  sticers,
  task,
  task_inv,
  telegram,
  vk,
  youtube
} from './images';
import { toast, ToastContainer } from 'react-toastify';
import axios, { AxiosError } from 'axios';
// import {parseClassName} from "react-toastify/dist/utils";

interface User {
  telegramId: string;
  name: string;
  points: number;
  // Добавьте другие поля, если они есть
}

const BoostPage = () => {
  const [telegramId, setTelegramId] = useState('');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [userData, setUserData] = useState<User | null>(null); // Состояние для хранения данных пользователя
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initialize = async () => {
      const searchParams = new URLSearchParams(location.search);
      const inviteCode = searchParams.get('invite');
      const telegramId = searchParams.get('telegramId');
      const activatedCodes = JSON.parse(localStorage.getItem('activatedCodes') || '{}');
      const storedCompletedTasks = JSON.parse(localStorage.getItem(`completedTasks_${telegramId}`) || '[]');

      if (telegramId) {
        setTelegramId(telegramId);

        // Загрузка данных пользователя
        const storedData = localStorage.getItem(`user_${telegramId}`);
        if (storedData) {
          setUserData(JSON.parse(storedData));
        }
      }

      if (inviteCode && telegramId && !activatedCodes[telegramId]) {
        try {
          await axios.post('/api/activate-invite', { inviteCode, telegramId: telegramId });
          toast.success('Инвайт-код успешно активирован! Вам и автору кода начислены бонусы.');
          activatedCodes[telegramId] = true;
          localStorage.setItem('activatedCodes', JSON.stringify(activatedCodes));
        } catch (error) {
          const axiosError = error as AxiosError;
          console.error('Ошибка активации инвайт-кода:', axiosError);
          toast.error('Ошибка активации инвайт-кода.');
        }
      }

      setCompletedTasks(storedCompletedTasks);
    };

    initialize();
  }, [location]);

  const handleButtonClick = (path: string) => {
    if (telegramId) {
      navigate(`${path}?telegramId=${telegramId}`);
    } else {
      navigate(path);
    }
  };

  const handleTaskClick = async (taskId: string) => {
    console.log(`Task clicked: ${taskId}`);

    if (completedTasks.includes(taskId)) {
      toast.info('Это задание уже выполнено.');
      return;
    }

    try {
      switch (taskId) {
        case 'telegram':
          window.open('https://t.me/+IYVWucpfDf1iOTMy', '_blank');
          addPointsToUser(Number(telegramId), 5);
          toast.success('Задание "Следи за нами в Телеграм" выполнено!');
          break;
        case 'vk':
          window.open('https://vk.com/ssledd', '_blank');
          addPointsToUser(Number(telegramId), 5);
          toast.success('Задание "Следи за нами в ВКонтакте" выполнено!');
          break;
        case 'youtube':
          window.open('https://rutube.ru/channel/41713965/', '_blank');
          addPointsToUser(Number(telegramId), 5);
          toast.success('Задание "Следи за нами в YouTube" выполнено!');
          break;
        case 'rutube':
          window.open('https://rutube.ru/channel/41713965/', '_blank');
          addPointsToUser(Number(telegramId), 5);
          toast.success('Задание "Следи за нами в RuTube" выполнено!');
          break;
        case 'boost':
          window.open('https://t.me/boost?c=2208788105', '_blank');
          addPointsToUser(Number(telegramId), 5);
          toast.success('Задание "Голосуй за нас" выполнено!');
          break;
        case 'sticers':
          window.open('https://t.me/addstickers/Sled19', '_blank');
          addPointsToUser(Number(telegramId), 5);
          toast.success('Задание "Забирай стикеры" выполнено!');
          break;
        default:
          toast.error('Неизвестное задание.');
      }

      // Обновляем состояние выполненных заданий и сохраняем в localStorage
      const newCompletedTasks = [...completedTasks, taskId];
      setCompletedTasks(newCompletedTasks);
      localStorage.setItem(`completedTasks_${telegramId}`, JSON.stringify(newCompletedTasks));
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Ошибка выполнения задания:', axiosError);
      toast.error('Ошибка выполнения задания.');
    }
  };

  const addPointsToUser = (telegramId: number, pointsToAdd: number) => {
    if (userData) {
      userData.points = userData.points + pointsToAdd;
      localStorage.setItem(`user_${telegramId}`, JSON.stringify(userData));
      toast.success(`Начислено ${pointsToAdd} баллов!`);
    } else {
      toast.error('Данные пользователя не найдены.');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="task-container">

      {/*<div className="absolute bottom-0 text-black container">*/}
      {/*  фывфыв {telegramId}*/}
      {/*  {userData && (*/}
      {/*    <div>*/}
      {/*      <p>Имя: {userData.name}</p>*/}
      {/*      <p>Баллы: {userData.points}</p>*/}
      {/*      /!* Другие данные пользователя *!/*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*</div>*/}

      <ToastContainer limit={1} />
      <div className="absolute top-0 flex w-full justify-center items-center bg-[#EDC448] h-1/3 task-top">
        <p className="text-5xl text-white font-bold text-center mb-20" style={{ lineHeight: '1', letterSpacing: '0.08em' }}>
          Заработай <br /> больше
        </p>
      </div>

      <div className="absolute w-full flex flex-col items-center justify-center bg-[#279E8B] rounded-3xl p-4 h-58 overflow-y-auto overflow-x-hidden">
         <div className="flex flex-col top-0 scrole mt-40 w-full items-center justify-center">
          <div className="active-code-block flex justify-center items-center w-88 mt-24 mb-3">
            <img src={telegram} width={45} height={45} className="mr-5" alt="Telegram" />
            <p className="text-white text-sm font-semibold">
              СЛЕДи за нами <br /> в Телеграм <br />
              <span className="text-[#f95758] text-x"> +5 следов</span>
            </p>
            <button
              className={`ml-auto flex items-center justify-center  text-black text-lg font-montserrat font-bold px-2 py-4 rounded-full w-12 h-12 ${completedTasks.includes('telegram') ? 'bg-[#f95758]' : 'red-shadow'}`}
              style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
              onClick={() => handleTaskClick('telegram')}
            >
            </button>
          </div>

          <div className="active-code-block flex justify-center items-center w-88 mt-1 mb-1">
            <div className="w-80 h-0.5 bg-gray-500"></div>
          </div>

          <div className="active-code-block flex justify-center items-center w-88 mt-3 mb-3">
            <img src={vk} width={45} height={45} className="mr-5" alt="VK" />
            <p className="text-white text-sm font-semibold">
              СЛЕДи за нами <br /> в ВКонтакте <br />
              <span className="text-[#f95758] text-x"> +5 следов</span>
            </p>
            <button
              className={`ml-auto flex items-center justify-center  text-black text-lg font-montserrat font-bold px-2 py-4 rounded-full w-12 h-12 ${completedTasks.includes('vk') ? 'bg-[#f95758]' : 'red-shadow'}`}
              style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
              onClick={() => handleTaskClick('vk')}
            >
            </button>
          </div>

          <div className="active-code-block flex justify-center items-center w-88 mt-1 mb-1">
            <div className="w-80 h-0.5 bg-gray-500"></div>
          </div>

          <div className="active-code-block flex justify-center items-center w-88 mt-3 mb-3">
            <img src={youtube} width={45} height={45} className="mr-5" alt="YouTube" />
            <p className="text-white text-sm font-semibold">
              СЛЕДи за нами <br /> в YouTube <br />
              <span className="text-[#f95758] text-x"> +5 следов</span>
            </p>
            <button
              className={`ml-auto flex items-center justify-center  text-black text-lg font-montserrat font-bold px-2 py-4 rounded-full w-12 h-12  ${completedTasks.includes('youtube') ? 'bg-[#f95758]' : 'red-shadow'}`}
              style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
              onClick={() => handleTaskClick('youtube')}
            >
            </button>
          </div>

          <div className="active-code-block flex justify-center items-center w-88 mt-1 mb-1">
            <div className="w-80 h-0.5 bg-gray-500"></div>
          </div>

          <div className="active-code-block flex justify-center items-center w-88 mt-3 mb-3">
            <img src={rutube} width={45} height={45} className="mr-5" alt="RuTube" />
            <p className="text-white text-sm font-semibold">
              СЛЕДи за нами <br /> в RuTube <br />
              <span className="text-[#f95758] text-x"> +5 следов</span>
            </p>
            <button
              className={`ml-auto flex items-center justify-center  text-black text-lg font-montserrat font-bold px-2 py-4 rounded-full w-12 h-12 ${completedTasks.includes('rutube') ? 'bg-[#f95758]' : 'red-shadow'}`}
              style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
              onClick={() => handleTaskClick('telegram')}
            >
            </button>
          </div>

          <div className="active-code-block flex justify-center items-center w-88 mt-1 mb-1">
            <div className="w-80 h-0.5 bg-gray-500"></div>
          </div>

          <div className="active-code-block flex justify-center items-center w-88 mt-3 mb-3">
            <img src={boost} width={45} height={45} className="mr-5" alt="Instagram" />
            <p className="text-white text-sm font-semibold">
              Голосуй за нас <br />
              <span className="text-[#f95758] text-x"> +5 следов</span>
            </p>
            <button
              className={`ml-auto flex items-center justify-center  text-black text-lg font-montserrat font-bold px-2 py-4 rounded-full w-12 h-12  ${completedTasks.includes('boost') ? 'bg-[#f95758]' : 'red-shadow'}`}
              style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
              onClick={() => handleTaskClick('boost')}
            >
            </button>
          </div>

          <div className="active-code-block flex justify-center items-center w-88 mt-1 mb-1">
            <div className="w-80 h-0.5 bg-gray-500"></div>
          </div>

          <div className="active-code-block flex justify-center items-center w-88 mt-3 mb-3">
            <img src={sticers} width={45} height={45} className="mr-5" alt="Facebook" />
            <p className="text-white text-sm font-semibold">
              Забирай стикеры <br />
              <span className="text-[#f95758] text-x"> +5 следов</span>
            </p>
            <button
              className={`ml-auto flex items-center justify-center  text-black text-lg font-montserrat font-bold px-2 py-4 rounded-full w-12 h-12  ${completedTasks.includes('sticers') ? 'bg-[#f95758]' : 'red-shadow'}`}
              style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
              onClick={() => handleTaskClick('sticers')}
            >
            </button>
          </div>

          <div className="active-code-block flex justify-center items-center w-88 mt-1 mb-1">
            <div className="w-80 h-0.5 bg-gray-500"></div>
          </div>

          <div className="active-code-block flex justify-center items-center w-88 mt-3 mb-3">
            <img src={sled} width={45} height={45} className="mr-5" alt="YouTube" />
            <p className="text-white text-sm font-semibold">
              Добавь  🐾 в имя <br />
              <span className="text-[#f95758] text-x"> +5 следов</span>
            </p>
            <button
              className={`ml-auto flex items-center justify-center  text-black text-lg font-montserrat font-bold px-2 py-4 rounded-full w-12 h-12  ${completedTasks.includes('youtube') ? 'bg-[#f95758]' : 'red-shadow'}`}
              style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
            >
            </button>
          </div>
        </div>

        <div className="absolute bottom-block">
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
    </div>
  );
};

export default BoostPage;