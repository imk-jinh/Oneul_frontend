'use client';
import Script from 'next/script';
import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import '../chatList/chatList.css';
import { Client } from '@stomp/stompjs';
import { ChatContext } from '../ChatContext'; // 필요한 경우 컨텍스트 사용
import { useUnread } from '../UnreadContext';
import { useRouter } from 'next/navigation'; // next/navigation으로 변경

function ClientHome() {
  const router = useRouter(); // Next.js의 useRouter를 사용
  const [alarm, setAlarm] = useState(true); // 하단 메뉴 벨
  const [chatList, setChatList] = useState([]); // 채팅방 목록
  const { myId } = useContext(ChatContext); // 필요한 경우 컨텍스트에서 myId 사용
  const { unreadCount } = useUnread();

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


  useEffect(() => {
    // 페이지가 로드되면 시 데이터를 가져옴
    fetchLists();

    // WebSocket 연결 설정
    const stompClient = new Client({
      brokerURL: process.env.NEXT_PUBLIC_Socket_URI,
      onConnect: () => {
        console.log('Connected');
        stompClient.subscribe(`/user/${myId}/queue/message`, (message) => {
          const data = JSON.parse(message.body);
          updateChatList(data); // 새로운 메시지가 오면 채팅방 목록 업데이트
        });
      },
      debug: (str) => {
        console.log(str);
      },
    });

    stompClient.activate();

    return () => stompClient.deactivate();
  }, [myId]);

  useEffect(() => {
    // 초 단위로 타임스탬프 업데이트
    const interval = setInterval(() => {
      setChatList((prevChatList) => [...prevChatList]); // chatList 상태를 갱신하여 리렌더링
    }, 1000); // 1초마다 실행

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 제거
  }, []);

  const fetchLists = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chatlist/getchatlist`,
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

      const mockChatList = await response.json();
      setChatList(mockChatList);
      console.log(mockChatList);
    } catch (error) {
      console.error('Failed to fetch chat list:', error);
    }
  };

  const updateChatList = (newMessage) => {
    const currentTime = new Date().toISOString(); // 현재 시간을 ISO 형식으로 가져옴

    setChatList((prevChatList) => {
      const existingChatIndex = prevChatList.findIndex(
        (chat) => chat.chatId === newMessage.roomId
      );

      if (existingChatIndex !== -1) {
        // 이미 존재하는 채팅방이 있다면 해당 채팅방의 데이터를 업데이트
        const updatedChatList = [...prevChatList];
        updatedChatList[existingChatIndex] = {
          ...updatedChatList[existingChatIndex],
          text: newMessage.text, // 최신 메시지로 업데이트
          date: currentTime, // 메시지 시간을 현재 시간으로 업데이트
        };
        return updatedChatList;
      } else {
        // 새로운 채팅방 추가 (이 부분은 필요하지 않을 수 있습니다. 요청에 따라 유지 또는 제거)
        return [...prevChatList, { ...newMessage, date: currentTime }];
      }
    });
  };

  const formatTimeDifference = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (!dateString) {
      return '';
    }

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const handleChatClick = (chat) => {
    const roomNumber = chat.chatId; // Assuming chatId is the room number
    const userId = chat.otherUserId; // Assuming userId is needed
    const userName = encodeURIComponent(chat.name); // Encoding name for safe URL usage
    const otherImg = encodeURIComponent(chat.img); // Assuming there's some emotion data
    const textData = encodeURIComponent(chat.text); // Text data

    window.location.href = `/userChat?room=${roomNumber}&user=${userId}&name=${userName}&profile=${otherImg}`;
  };

  return (
    <div className="frame">
      <div className="top_fixed">
        <p className="title">채팅</p>
        <Script
          src="//t1.daumcdn.net/kas/static/ba.min.js"
          strategy="lazyOnload" // 페이지 로드 후 비동기적으로 로드
        />

        <ins
          className="kakao_ad_area"
          data-ad-unit="DAN-StwrP2FQQrzd1iOD"
          data-ad-width="320"
          data-ad-height="50"
        ></ins>
      </div>

      <div className="content_space">
        {chatList.map((chat, index) => (
          <div
            key={index}
            className="matched-box"
            onClick={() => handleChatClick(chat)} // Handle click
            style={{ cursor: 'pointer' }} // Change cursor to indicate clickability
          >
            <div className="matched-content">
              <img className="matchUserProfile" src={chat.img} />
              <span className="matchedUser_info">
                <div className="matchedUserNameZone">
                  <p className="matchedUserName">{chat.name}</p>
                  <p className="recentTime">
                    {formatTimeDifference(chat.date)}
                  </p>
                  {!chat.flag && <div className="flagredCircle" />}
                </div>
                <p className="matchedChat">{chat.text}</p>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bottom_line">
        {/* 하단 메뉴바 */}
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
    </div>
  );
}

export default ClientHome;
