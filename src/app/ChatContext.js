'use client';

import React, { createContext, useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [room, setRoom] = useState(null);
  const [myId, setMyId] = useState(0);
  const [otherRoomMessages, setOtherRoomMessages] = useState(null);
  const [client, setClient] = useState(null);

  useEffect(() => {
    // 유저 정보를 가져와서 myId 설정
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/home/gethomeuserinfo', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        return response.json();
      })
      .then((data) => {
        setMyId(data.user_id);
      })
      .catch((error) => {
        console.error('Failed to fetch user info:', error);
      });
  }, []);

  useEffect(() => {
    if (myId) {
      // myId가 존재할 때만 WebSocket 구독을 설정
      const stompClient = new Client({
        brokerURL: process.env.NEXT_PUBLIC_Socket_URI,
        onConnect: () => {
          console.log('Connected');
          stompClient.subscribe('/topic/public', (message) => {
            // public 메시지 처리
          });

          stompClient.subscribe(
            `/user/${myId}/queue/message`,
            (message) => {
              const data = JSON.parse(message.body);

              if (String(data.roomId) === String(room)) {
                setMessages((prevMessages) => {
                  const existingMessageIndex = prevMessages.findIndex(
                    (msg) => msg.chatId === data.chatId
                  );

                  if (existingMessageIndex !== -1) {
                    const updatedMessages = [...prevMessages];
                    updatedMessages[existingMessageIndex] = data;
                    return updatedMessages;
                  } else {
                    return [...prevMessages, data];
                  }
                });
              } else {
                setOtherRoomMessages(data);
              }

              console.log(data);
            },
            { id: `${myId}` }
          );
        },
        debug: (str) => {
          console.log(str);
        },
      });

      stompClient.activate();
      setClient(stompClient);

      return () => stompClient.deactivate();
    }
  }, [myId, room]); // myId가 설정된 후에만 effect 실행

  useEffect(() => {
    if (otherRoomMessages) {
      const timer = setTimeout(() => {
        setOtherRoomMessages(null); // 5초 후 메시지 클리어
      }, 5000);

      return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머 해제
    }
  }, [otherRoomMessages]);

  return (
    <ChatContext.Provider
      value={{ room, setRoom, myId, otherRoomMessages, setOtherRoomMessages }}
    >
      {children}
    </ChatContext.Provider>
  );
};
