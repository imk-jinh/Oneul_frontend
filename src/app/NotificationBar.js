'use client'; // 이 지시문을 추가합니다

import React, { useContext } from 'react';
import { ChatContext } from './ChatContext';

function NotificationBar() {
  const { otherRoomMessages, setOtherRoomMessages } = useContext(ChatContext);

  const handleRoomSwitch = () => {
    if (otherRoomMessages && otherRoomMessages.roomId) {
      window.history.replaceState(
        null,
        '',
        `/userChat?room=${otherRoomMessages.roomId}`
      );
      window.location.reload(); // 새 URL로 페이지를 리로드
    } else {
      console.error('No room information available');
    }
  };

  return (
    <div className="notification-bar" onClick={handleRoomSwitch}>
      {otherRoomMessages && (
        <div className="notification">
          <img src={otherRoomMessages.img} alt="Profile" />
          <div className="notification-content">
            <p className="name">{otherRoomMessages.name}</p>
            <p className="text">{otherRoomMessages.text}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBar;
