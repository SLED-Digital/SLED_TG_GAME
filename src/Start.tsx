import React from 'react';
import './Start.css';
import bear from "./bear.mp4"

const BackgroundPage: React.FC = () => {
  return (
    <div className="background-page">
      <div className="content">
        <video className="video" autoPlay muted loop>
          <source src={bear} type="video/mp4" />
          Ваш браузер не поддерживает элемент video.
        </video>
      </div>
    </div>
  );
};

export default BackgroundPage;
