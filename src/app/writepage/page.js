'use client';

import '../writepage/writepage.css';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useUnread } from '../UnreadContext';
import { useRouter } from 'next/navigation'; // next/navigation으로 변경

function ClientHome() {
  const [today, setToday] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState('');
  const [writtenTitle, setwrittenTitle] = useState(null); // 쓴 일기 타이틀
  const [writtenTag, setwrittenTag] = useState([]); // 쓴 일기 해시태그
  const [writtenContent, setwrittenContent] = useState(null); // 쓴 일기 내용
  const year = today.getFullYear;
  const day = String(today.getDate()).padStart(2, '0');
  const [writtenPhotos, setwritteenPhotos] = useState([]);
  const [alarm, setalarm] = useState(true);
  const [showEmoticons, setShowEmoticons] = useState(false); // 이모티콘 펼침 상태 추가
  const { unreadCount } = useUnread();
  const router = useRouter(); // Next.js의 useRouter를 사용

  // 이모티콘 이미지를 딕셔너리 형태로 관리
  const emoticonImages = {
    행복: '/home/emotion/happy.svg',
    화남: '/home/emotion/angry.svg',
    싫음: '/home/emotion/hate.svg',
    기본: '/home/emotion/normal.svg',
    슬픔: '/home/emotion/sad.svg',
    공포: '/home/emotion/scary.svg',
    놀람: '/home/emotion/suprise.svg',
  };
  // 선택한 감정 이모티콘을 문자열로 관리 (기본 값: "기본")
  const [selectedEmoticon, setSelectedEmoticon] = useState('기본');

  useEffect(() => {
    // 현재 월 설정
    setCurrentMonth(today.toLocaleString('default', { month: 'short' }));

    // 주석 처리된 fetch 부분
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/diary/getDetailDiary', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // 필요한 경우 기타 헤더를 추가할 수 있습니다.
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        return response.json();
      })
      .then((data) => {
        const todayDiaries = data.filter(
          (diary) => diary.date === today.toISOString().slice(0, 10)
        );
        // 가장 최근 날짜의 제목을 찾습니다.
        if (todayDiaries.length > 0) {
          const recentDiary = todayDiaries.reduce((prev, curr) => {
            return new Date(prev.date) > new Date(curr.date) ? prev : curr;
          });
          setwrittenTitle(recentDiary.title);
          setwrittenTag(recentDiary.tags);
          setwrittenContent(recentDiary.text);
          const images = recentDiary.images.slice(0, 3);
          setwritteenPhotos(images);
        }
      })
      .catch((error) => {
        console.log('데이터 GET 오류: ', error);
      });
  }, [today]);

  // 이모티콘 선택 함수
  const handleEmoticonSelect = (emotionKey) => {
    setSelectedEmoticon(emotionKey); // 이모티콘 키(예: "행복")를 선택 상태로 설정
    setShowEmoticons(false); // 이모티콘 선택 후 닫기
  };

  // 감정 이모티콘 펼침/접힘 토글 함수
  const toggleEmoticons = () => {
    setShowEmoticons(!showEmoticons);
  };

  const handleExitClick = () => {
    router.replace("/home")
};

  return (
    <div className="frame">
      <div className="top_fixed2">
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
      <div className="profile-space">
        <img className="left-arrow3" onClick={handleExitClick} src="mypage/left-arrow.svg" />
        <div className="mypage-title">
          <span className="mypage-title"> 뒤로가기 </span>
        </div>
      </div>

      {/* 브랜치 추가 */}
      <div className="content_space1">
        <img className="shareIcon" src="/writePage/shareIcon.svg" />
        {/* 선택된 이모티콘을 이미지로 표시 */}
        <img
          className="emotion_select1"
          src={emoticonImages[selectedEmoticon]} // 선택된 이모티콘의 이미지 경로로 설정
          onClick={toggleEmoticons}
        />

        {showEmoticons && (
          <div className="emoticon_select1">
            {Object.keys(emoticonImages).map((emotionKey, index) => (
              <img
                key={index}
                src={emoticonImages[emotionKey]}
                className={`emoticon-item ${
                  selectedEmoticon === emotionKey ? 'selectedEmotiicon' : ''
                }`}
                onClick={() => handleEmoticonSelect(emotionKey)} // 이모티콘 선택 시 문자열 키 전달
              />
            ))}
          </div>
        )}

        <div className="innerSpace1">
          <div className="top_group1">
            <div className="blockleft">
              <p className="today_day">{day}</p>
              <p className="today_month">{currentMonth}</p>
            </div>

            <div className="blockRight">
              <p className="diary_title1">{writtenTitle}</p>
              <div className="diary_hashTagBox">
                {writtenTag.map((tag, index) => (
                  <p className="diary_hashtag" key={index}>
                    #{tag}
                  </p>
                ))}
              </div>

              <div className="text_space">{writtenContent}</div>
              <div className="imageBox">
                {writtenPhotos.map((photo, index) => (
                  <img
                    key={index}
                    className="`image_${index + 1}`"
                    src={photo}
                    alt={`Diary Image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
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
