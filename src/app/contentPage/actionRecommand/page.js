'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '../actionRecommand/actionRecommand.css';
import Script from 'next/script';
import { useUnread } from '../../UnreadContext';

function ClientHome() {
  const [actionRecommendations, setActionRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alarm, setalarm] = useState(true); // 하단 메뉴 벨
  const [dialogMessage, setDialogMessage] = useState(''); // 다이얼로그 메시지 추가
  const { unreadCount } = useUnread();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setDialogMessage('행동 추천을 생성 중입니다...');
        const response = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/action/makeAction',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({}),
          }
        );

        if (!response.ok) {
          throw new Error('네트워크 응답이 올바르지 않습니다.');
        }

        const data = await response.json();
        console.log('추천 행동 데이터:', data);
        setActionRecommendations(data);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        setDialogMessage('데이터를 가져오는 중 오류 발생:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="frame">
      <div className="top_fixed">
        <p className="title">행동 추천</p>
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
        <div className="eventSpace">
          <span className="eventName">오늘 일기의 행동 추천</span>
        </div>

        <div className="actionBox_Area">
          {loading ? (
            <div className="dialog">
              <p>{dialogMessage}</p>
            </div>
          ) : error ? (
            <div className="dialog">
              <p>{dialogMessage}</p>
            </div>
          ) : (
            actionRecommendations.slice(0, 2).map((rec, index) => (
              <div className="actionBox_type1" key={index}>
                <span className="actionName">{rec.action_name}</span>
                <span className="actionExplain">{rec.description}</span>
              </div>
            ))
          )}
        </div>

        <div className="actionBox_Area2">
          {loading ? (
            <p></p>
          ) : (
            actionRecommendations.slice(2, 4).map((rec, index) => (
              <div className="actionBox_type1" key={index}>
                <span className="actionName">{rec.action_name}</span>
                <span className="actionExplain">{rec.description}</span>
              </div>
            ))
          )}
        </div>
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
