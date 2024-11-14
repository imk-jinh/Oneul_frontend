'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export const UnreadContext = createContext();

export const UnreadProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchLists();

    const intervalId = setInterval(fetchLists, 3000); // Poll every minute

    return () => clearInterval(intervalId);
  }, []);

  const fetchLists = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/Alarm/getMyAlarm`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch: ${response.status} ${response.statusText}`
        );
      }

      const alarmData = await response.json();

      const updatedNotifications = alarmData.map((alarm) => ({
        id: alarm.id,
        read: alarm.read_flag,
      }));

      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <UnreadContext.Provider value={{ unreadCount, setNotifications }}>
      {children}
    </UnreadContext.Provider>
  );
};

export const useUnread = () => {
  return useContext(UnreadContext);
};
