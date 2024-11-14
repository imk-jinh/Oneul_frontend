'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '../contentPage/contentPage.css';
import Script from 'next/script';
import { useUnread } from '../UnreadContext';
import { useRouter } from 'next/navigation'; // next/navigation으로 변경

function ClientHome() {
  const router = useRouter(); // Next.js의 useRouter를 사용
  const [alarm, setalarm] = useState(true);
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


  return (
    <div className="frame">
      <div className="top_fixed">
        <p className="title">콘텐츠</p>

        <ins
          className="kakao_ad_area"
          data-ad-unit="DAN-StwrP2FQQrzd1iOD"
          data-ad-width="320"
          data-ad-height="50"
        ></ins>
      </div>

      <div className="contentcontent_space">
        <div>
          <div className="eventBox">
            <p className="eventName">비슷한 하루 채팅 매칭하기</p>
            <Link href="/contentPage/matching">
              <div className="eventImgBox">
                <img className="backImg" src="/contentPage/matchingImg.svg" />
                <div className="centeredContent">
                  <p className="contentName" id="boldWhite">
                    매칭하기
                  </p>
                  <p className="contentText" id="white">
                    나와 비슷한 하루를 보낸 사람들과 채팅해보세요!
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="eventBox">
            <p className="eventName">오늘. 내 일기의 시 보러가기</p>
            <Link href="/contentPage/makePoem">
              <div className="eventImgBox">
                <img className="backImg" src="/contentPage/poemImg.svg" />
                <div className="centeredContent">
                  <p className="contentName" id="boldBlack">
                    오늘. 의 시
                  </p>
                  <p className="contentText" id="black">
                    내가 쓴 일기를 시로 작성해줘요!
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="eventBox">
            <p className="eventName">내 행동 추천 보러가기</p>
            <Link href="/contentPage/actionRecommand">
              <div className="eventImgBox">
                <img
                  className="backImg"
                  src="/contentPage/actionRecommandImg.svg"
                />
                <div className="centeredContent">
                  <p className="contentName" id="boldWhite">
                    행동 추천
                  </p>
                  <p className="contentText" id="white">
                    일기에 쓴 생각들을 추적해,
                    <br />
                    내가 실천 할 수 있는 행동들을 보여줘요!
                  </p>
                </div>
              </div>
            </Link>
          </div>
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
