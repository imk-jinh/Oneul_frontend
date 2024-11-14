'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Script from 'next/script';
import '../makePoem/makePoem.css';
import { useUnread } from '../../UnreadContext';

function ClientHome() {
  const [alarm, setAlarm] = useState(true); // 하단 메뉴 벨
  const [poems, setPoems] = useState([]); // 시 목록 저장 변수
  const [todayPoem, setTodayPoem] = useState(null); // 오늘의 시
  const [isDialogOpen, setIsDialogOpen] = useState(false); // 다이얼로그 상태 추가
  const [dialogMessage, setDialogMessage] = useState(''); // 다이얼로그 메시지 추가
  const { unreadCount } = useUnread();

  useEffect(() => {
    // 페이지가 로드되면 시 데이터를 가져옴
    fetchPoems();
  }, []);

  const fetchPoems = async () => {
    try {
      // 현재 날짜를 기반으로 년도와 월을 계산
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 +1

      const formData = {
        year: year,
        month: month,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/poetry/getpoetry`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch: ${response.status} ${response.statusText}`
        );
      }

      const allPoems = await response.json();

      const todayDate = currentDate.toISOString().split('T')[0];
      const todayPoem = allPoems.find((poem) => poem.date === todayDate);

      setTodayPoem(todayPoem);
      setPoems(allPoems.filter((poem) => poem.date !== todayDate));
    } catch (error) {
      console.error('Failed to fetch poems:', error);
      setPoems([]);
    }
  };

  const handleCreatePoem = async () => {
    setIsDialogOpen(true); // 다이얼로그 열기
    setDialogMessage('시를 생성 중입니다...');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/genpoem`,
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

      await fetchPoems(); // 시 데이터를 새로 가져옵니다.

      setDialogMessage('시가 생성되었습니다!');
      setTimeout(() => {
        setIsDialogOpen(false); // 다이얼로그 닫기
      }, 1500); // 잠시 대기 후 다이얼로그 닫기
    } catch (error) {
      console.error('Failed to create poem:', error);
      setDialogMessage(
        <>
          <p>시 생성 중 오류가 발생했습니다.</p>
          <p>시가 없으면 시를 작성하고 다시 시도해주세요.</p>
        </>
      );
      setTimeout(() => {
        setIsDialogOpen(false); // 오류 발생 시에도 다이얼로그 닫기
      }, 3000); // 오류 메시지를 더 오래 보여줌
    }
  };

  return (
      <div className="frame">
          <div className="top_fixed">
              <p className="title">콘텐츠</p>
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
          <span className="eventName">오늘.의 시</span>
          <div className="calenderIconWrapper">
            <img
              className="calenderIcon"
              src="/contentPage/makePoem/calender.svg"
            />
          </div>
        </div>

        {!todayPoem && (
          <div className="no-poemBox">
            <p>오늘의 시가 아직 없습니다.</p>
            <button className="create-poem-button" onClick={handleCreatePoem}>
              생성하기
            </button>
          </div>
        )}

        {isDialogOpen && (
          <div className="dialog">
            <p>{dialogMessage}</p>
          </div>
        )}

        {todayPoem && (
          <div className="poemBox">
            <div className="poem_top">
              <span className="poem_title">{todayPoem.title}</span>
              <span className="poem_day">
                {new Date(todayPoem.date).getDate()}
              </span>
            </div>

            <div className="poem_content">
              {todayPoem.text.split('\n\n').map((line, idx) => (
                <p key={idx} className="fragment">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {poems.length > 0 &&
          poems.map((poem, index) => (
            <div key={index} className="poemBox">
              <div className="poem_top">
                <span className="poem_title">{poem.title}</span>
                <span className="poem_day">
                  {new Date(poem.date).getDate()}
                </span>
              </div>

              <div className="poem_content">
                {poem.text.split('\n\n').map((line, idx) => (
                  <p key={idx} className="fragment">
                    {line}
                  </p>
                ))}
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
