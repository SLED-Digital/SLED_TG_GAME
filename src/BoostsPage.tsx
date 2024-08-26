// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axios from 'axios';
//
// const BoostPage = () => {
//   const [tasks, setTasks] = useState([]);
//   const [isSubscribed, setIsSubscribed] = useState(false);
//
//   const navigate = useNavigate();
//
//   useEffect(() => {
//     // Загружаем список задач при монтировании компонента
//     fetchTasks();
//     const subscriptionStatus = localStorage.getItem('isSubscribed') === 'true';
//     setIsSubscribed(subscriptionStatus);
//   }, []);
//
//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get('/api/tasks');
//       setTasks(response.data);
//     } catch (error) {
//       console.error('Ошибка загрузки задач:', error);
//       toast.error('Не удалось загрузить задачи.');
//     }
//   };
//
//   const handleSubscription = async () => {
//     try {
//       // Здесь предполагается, что у вас есть API для управления подпиской
//       const response = await axios.post('/api/subscribe');
//       if (response.data.success) {
//         toast.success('Вы успешно подписались на Telegram-канал!');
//         setIsSubscribed(true);
//         localStorage.setItem('isSubscribed', 'true');
//       }
//     } catch (error) {
//       console.error('Ошибка подписки на Telegram-канал:', error);
//       toast.error('Ошибка подписки на Telegram-канал.');
//     }
//   };
//
//   const handleClaimReward = async (taskId) => {
//     if (!isSubscribed) {
//       toast.error('Сначала необходимо подписаться на канал Telegram!');
//       return;
//     }
//
//     try {
//       const response = await axios.post(`/api/claim-reward`, { taskId });
//       if (response.data.success) {
//         toast.success('Награда успешно получена!');
//         fetchTasks(); // перезагружаем задачи чтобы обновить статусы
//       } else {
//         toast.error('Ошибка получения награды.');
//       }
//     } catch (error) {
//       console.error('Ошибка получения награды:', error);
//       toast.error('Ошибка получения награды.');
//     }
//   };
//
//   return (
//     <div className="tasks-container">
//       <div className="absolute top-0 w-full h-20 flex items-center justify-center tasks-top bg-yellow-500">
//         <p className="text-2xl font-bold">Задания</p>
//       </div>
//       <div className="absolute top-1/4 w-full h-1/2 tasks-middle flex flex-col items-center justify-center bg-green-500 rounded-3xl p-4">
//         <p className="text-lg font-semibold mb-4">
//           Выполняйте задания и получайте награды!
//         </p>
//         {!isSubscribed && (
//           <button
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
//             onClick={handleSubscription}
//           >
//             Подписаться на Telegram-канал
//           </button>
//         )}
//         <div className="tasks-list w-full">
//           {tasks.length > 0 ? (
//             tasks.map(task => (
//               <div key={task.id} className="task-item p-4 mb-2 bg-white rounded-lg shadow-lg">
//                 <p>{task.description}</p>
//                 <button
//                   className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
//                   onClick={() => handleClaimReward(task.id)}
//                 >
//                   Получить награду
//                 </button>
//               </div>
//             ))
//           ) : (
//             <p>Заданий пока нет.</p>
//           )}
//         </div>
//       </div>
//
//       <div className="absolute bottom-0 left-0 w-full px-3 pb-3 z-22 navigatblock">
//         <div className="w-full flex justify-between gap-2 navigat bg-teal-500 py-4 rounded-2xl">
//           <button onClick={() => navigate('/frens')}>
//             <p>Frens</p>
//           </button>
//           <button onClick={() => navigate('/')}>
//             <p>Home</p>
//           </button>
//           <button onClick={() => navigate('/boosts')}>
//             <p>Boosts</p>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// // export default Tasks;
//
// export default BoostPage;