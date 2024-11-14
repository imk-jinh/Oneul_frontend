'use client'; // Mark the component as a Client Component

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import '../notification/notification.css';
import Script from 'next/script';
import { useUnread } from '../UnreadContext';
import { useRouter } from 'next/navigation'; // next/navigation으로 변경

// 날짜별 섹션을 관리하기 위한 유틸리티 함수
const formatDateDifference = (date) => {
  const { unreadCount } = useUnread();
  const today = new Date();
  const notificationDate = new Date(date);
  const differenceInTime = today - notificationDate;
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

  if (differenceInDays === 0) return '오늘';
  if (differenceInDays === 1) return '어제';
  if (differenceInDays < 7) return `${differenceInDays}일 전`;
  return '1주일 전';
};

// 카테고리별 아이콘 경로 매칭 함수
const getIconByCategory = (category) => {
  switch (category) {
    case 'chat':
      return '../notification/AiChat-icon.svg';
    case 'content':
      return '../notification/contentImg.svg';
    case 'notification':
      return '../notification/bell.svg';
    default:
      return '../notification/bell.svg';
  }
};

function ClientHome() {
  const router = useRouter(); // Next.js의 useRouter를 사용
  const [notifications, setNotifications] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all'); // 선택된 카테고리 상태 추가
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;
  const dropdownRef = useRef(null); // Create a reference for the dropdown
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [alarm, setAlarm] = useState(true);

  useEffect(() => {
    fetchLists();
  }, []);

  const loadKakaoAds = () => {
    if (window.kakao && window.kakao.adfit) {
      window.kakao.adfit.render();
    } else {
      // 스크립트를 다시 로드
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
      script.async = true;
      script.onload = () => {
        if (window.kakao && window.kakao.adfit) {
          window.kakao.adfit.render();
        }
      };
      document.body.appendChild(script);
    }
  };

  // 페이지 이동 후 광고 스크립트 로드
  useEffect(() => {
    loadKakaoAds();
  }, [router.pathname]); // 경로가 바뀔 때마다 광고 로드



  const fetchLists = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/Alarm/getMyAlarm`,
        {
          method: 'GET',
          credentials: 'include', // 인증 정보를 포함하도록 설정
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
        text: alarm.text,
        date: alarm.date,
        icon: getIconByCategory(alarm.category),
        category: alarm.category,
        read: alarm.read_flag,
      }));

      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Failed to fetch chat list:', error);
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationOpen(false); // Close the dropdown if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (selectedCategory === 'all') return true;
    return notification.category === selectedCategory;
  });

  const handleReadAlarm = async (alarmId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/Alarm/readAlarm?alarmId=${alarmId}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark as read');
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === alarmId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark alarm as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const alarmIds = notifications.map((notification) => notification.id);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/Alarm/readAll`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(alarmIds),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark all as read');
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error('Failed to mark all alarms as read:', error);
    }
  };

  const groupNotificationsByDate = () => {
    const grouped = filteredNotifications.reduce((acc, notification) => {
      const dateCategory = formatDateDifference(notification.date);
      if (!acc[dateCategory]) {
        acc[dateCategory] = [];
      }
      acc[dateCategory].push(notification);
      return acc;
    }, {});
    return grouped;
  };

  const groupedNotifications = groupNotificationsByDate();

  return (
    <div className="frame">
      <div className='top_frame'>
        <div className="top_fixed">
          <ins
            className="kakao_ad_area"
            data-ad-unit="DAN-StwrP2FQQrzd1iOD"
            data-ad-width="320"
            data-ad-height="50"
          ></ins>

          <div className="top">
            <Link href="/home">
              <img className="leftArrow" src="../notification/left-arrow.svg" />
            </Link>
            <span className="noti">알림</span>
            <div className="all_read" onClick={handleMarkAllAsRead}>
              모두 읽음
            </div>
          </div>
        </div>
      </div>

      <div className="top2">
        <span className="unread-notification">
          읽지 않은 알람 {unreadCount} 건
        </span>
        <span onClick={handleNotificationClick}>
          <span className="all-notifications">전체 알림 </span>
          <img className="arrow-down" src="../notification/arrow-down.svg" />
        </span>
      </div>
      <div className="separation-container" />

      <div className="Acontainer">

        {Object.keys(groupedNotifications).map((dateGroup) => (
          <div key={dateGroup}>
            <div className="day-notification">{dateGroup}</div>
            {groupedNotifications[dateGroup].map((notification) => (
              <div
                key={notification.id}
                className="noti-box"
                style={{
                  backgroundColor: notification.read ? 'white' : '#FFFEED',
                }}
                onClick={() => handleReadAlarm(notification.id)}
              >
                <div className="noti-content">
                  <img className="noti-icon" src={notification.icon} />
                  <span className="noti-text">{notification.text}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="bottom_line">
        <div className="menuBar">
          <Link href="/chatList">
            <img className="chatImg" src="/home/chatImg.svg" />
          </Link>
          <Link href="/contentPage">
            <img className="contentImg" src="/home/contentImg.svg" />
          </Link>
          <Link href="/home">
            <img className="home" src="/home/home.svg" />
          </Link>
          <Link href="/notification">
            <div className="bellSpace">
              <img className="bellImg" src="/home/bell.svg" />
              {unreadCount > 0 && <div className="redCircle"></div>}
            </div>
          </Link>
          <Link href="/mypage">
            <img className="myPageImg" src="/home/myPageImg.svg" />
          </Link>
        </div>
      </div>

      {/* Dropdown section with ref */}
      <div
        ref={dropdownRef}
        className={`notification-dropdown ${isNotificationOpen ? 'open' : ''}`}
      >
        <div className="choice-noti">보고 싶은 알림 선택</div>
        <div
          className="notification-option"
          onClick={() => setSelectedCategory('all')}
        >
          전체 알림
        </div>
        <div
          className="notification-option"
          onClick={() => setSelectedCategory('chat')}
        >
          채팅 알림
        </div>
        <div
          className="notification-option"
          onClick={() => setSelectedCategory('diary')}
        >
          일기 알림
        </div>
        <div
          className="notification-option"
          onClick={() => setSelectedCategory('content')}
        >
          콘텐츠 알림
        </div>
      </div>
    </div>
  );
}

export default ClientHome;
