'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import '../home/home.css';
import { useRouter } from 'next/navigation'; // next/navigation으로 변경
import { useUnread } from '../UnreadContext';

function ClientHome() {
  const router = useRouter(); // Next.js의 useRouter를 사용
  const { unreadCount } = useUnread();

  const [IsMobile, setIsMobile] = useState(false);
  const [calendarData, setCalendarData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [today, setToday] = useState(new Date());
  const [Language, setLanguage] = useState(null);
  const [Name, setName] = useState(null);
  const [Img, setImg] = useState([]);
  const [monthtagList, setmonthtagList] = useState([]);
  const [monthdiaryList, setmonthdiaryList] = useState([]);
  const [todayDiary, settodayDiary] = useState(false);
  const [alarm, setalarm] = useState(true);
  const [selectOption, setselectOption] = useState(false);
  const [writtenDiaryPhotos, setwrittenDiaryPhotos] = useState([]);

  const [diaryClickedIndex, setdiaryClickedIndex] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');


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


  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalImage('');
  };

  const diaryHandleClick = (index) => {
    setdiaryClickedIndex(index === diaryClickedIndex ? null : index);
  };

  // 한글 감정 텍스트와 영어 텍스트 간의 매핑 객체
  const emotionMap = {
    행복: 'happy',
    화남: 'angry',
    슬픔: 'sad',
    놀람: 'surprise',
    공포: 'scary',
    싫음: 'hate',
    기본: 'normal',
    // 필요한 경우 추가 감정을 여기에서 정의합니다.
  };

  const year = today.getFullYear(); // 연도
  const month = String(today.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 1을 더하고 두 자리로 포맷)
  const day = String(today.getDate()).padStart(2, '0'); // 일 (두 자리로 포맷)

  const formattedDate = `${year}-${month}-${day}`;

  const monthtagFetchData = () => {
    const formData = {
      year: parseInt(year), // year 변수가 잘 정의되었다고 가정합니다.
      month: parseInt(month), // month 변수가 잘 정의되었다고 가정합니다.
    };

    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/home/getmonthtag', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);

        setmonthtagList(data);
      })
      .catch((error) => {
        console.error('데이터 가져오기 오류:', error);
      });
  };

  const monthdiaryFetchData = () => {
    const formData = {
      year: parseInt(year), // year 변수가 잘 정의되었다고 가정합니다.
      month: parseInt(month), // month 변수가 잘 정의되었다고 가정합니다.
    };

    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/home/getmonthdiary', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setmonthdiaryList(data);

        const today = new Date();
        const todayYear = today.getFullYear();
        const todayMonth = (today.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
        const todayDay = today.getDate().toString().padStart(2, '0');

        const foundTodayDiary = data.some((data) => {
          const [diaryYear, diaryMonth, diaryDay] = data.date.split('-');
          const isCurrentMonth =
            diaryYear === todayYear.toString() && diaryMonth === todayMonth;

          return isCurrentMonth && diaryDay === todayDay;
        });

        if (!foundTodayDiary) {
          settodayDiary(true);
        } else {
          settodayDiary(false);
        }
      })
      .catch((error) => {
        console.error('데이터 가져오기 오류:', error);
      });
  };

  const userinfoFetchData = () => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/home/gethomeuserinfo', {
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
        setName(data.nickname);
        setImg(data.img);
        setLanguage(data.language);

        console.log(data);
        // 예: 받은 데이터를 화면에 표시하는 등의 작업 수행

        if (!data.language || data.language === ' ') {
          router.replace('/choiceLanguage');
          return;
        }
        if (!data.nickname || data.nickname === ' ') {
          router.replace('/setName');
          return;
        }
        console.log(data.language);
        console.log(data.nickname);
      })
      .catch((error) => {
        console.error('데이터 가져오기 오류:', error);
      });
  };

  useEffect(() => {
    userinfoFetchData();
    monthdiaryFetchData();
    monthtagFetchData();
  }, []);

  useEffect(() => {
    monthdiaryFetchData();
    monthtagFetchData();
  }, [currentMonth]);

  useEffect(() => {
    if (Name && Language) {
      return;
    }
  }, [Name, Language, router]);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const mobileKeywords = ['iphone', 'ipad', 'ipod', 'android'];
    const isMobileDevice = mobileKeywords.some((keyword) =>
      userAgent.includes(keyword)
    );
    setIsMobile(isMobileDevice);

    // 초기 달력 데이터 생성
    const initialCalendarData = Array(6)
      .fill(null)
      .map(() => Array(7).fill(null));

    // 현재 월의 시작일을 찾아서 달력 데이터 업데이트
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startingDay = firstDayOfMonth.getDay(); // 0 (일요일)부터 6 (토요일)까지
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ); // 현재 월의 마지막 날짜
    const lastDate = lastDayOfMonth.getDate(); // 마지막 날짜

    let dayCounter = 1;

    const updatedCalendarData = initialCalendarData.map((row, rowIndex) => {
      return row.map((_, colIndex) => {
        if (rowIndex === 0 && colIndex < startingDay) {
          // 이번 달 시작일 이전의 칸은 비워둠
          return null;
        }

        const dayValue = dayCounter;
        dayCounter++;

        // 현재 월의 마지막 날짜를 초과하는 경우 null 반환
        if (dayValue > lastDate) {
          return null;
        }

        return dayValue; // 현재 날짜로 업데이트
      });
    });

    // 추가 코드: 마지막 주가 비어있을 경우, 빈 줄 추가
    if (updatedCalendarData[5].every((day) => day === null)) {
      updatedCalendarData.pop();
    }

    setCalendarData(updatedCalendarData);

    // 현재 월과 연도 설정
    setCurrentMonth(today.toLocaleString('default', { month: 'short' }));
    setCurrentYear(today.getFullYear().toString());
  }, [today]);

  // 클릭 이벤트 핸들러
  const handleDateClick = (day) => {
    // // 날짜를 "1/년도-월-일/daily" 형식으로 포맷

    // const formattedDate = `${currentYear}-${currentMonth}-${day}/daily`;
    // // 페이지 이동
    // const cleanedFormattedDate = formattedDate.replace('월', '');

    // window.location.href = cleanedFormattedDate;
  };

  // 이전 달로 이동하는 함수
  const goToPreviousMonth = () => {
    const newDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    setToday(newDate);
  };

  // 다음 달로 이동하는 함수
  const goToNextMonth = () => {
    const newDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    setToday(newDate);
  };

  // 이번 달 날짜 요소 렌더링
  const renderedCalendar = calendarData.map((row, rowIndex) => {
    return (
      <div className="days_line" id={`${rowIndex}line`} key={`${rowIndex}line`}>
        {row.map((day, colIndex) => {
          if (day === null) {
            return <p key={`dd${rowIndex}-${colIndex}`} />;
          }

          // 현재 달이 렌더링 중인 달과 같고 연도가 같으며, 날짜도 오늘인지 확인
          const isSameMonth = today.getMonth() === new Date().getMonth();
          const isSameYear = today.getFullYear() === new Date().getFullYear();
          const isToday =
            parseInt(day, 10) === new Date().getDate() &&
            isSameMonth &&
            isSameYear;

          // 조건에 따라 클래스 적용
          const classNames = isToday
            ? 'item-1-sao date-inactive-4Uw'
            : 'item-1-sao';

          return (
            <p
              className={classNames}
              id={`dd${rowIndex * 7 + colIndex + 1}`}
              key={`dd${rowIndex}-${colIndex}`}
              onClick={() => handleDateClick(day)}
            >
              {day}
            </p>
          );
        })}
      </div>
    );
  });

  // 일기 이동 하단 클릭 이벤트 핸들러
  const handleItemClick = (item) => {
    // item.day 또는 item.text를 사용하여 이동할 경로 생성
    const itemPath = `/${MemberId}/${item.day}/daily`; // 예시 경로

    // 페이지 이동
    window.location.href = itemPath;
  };

  function getEnglishMonth(monthNumber) {
    switch (monthNumber) {
      case 1:
        return 'January';
      case 2:
        return 'Feburuay';
      case 3:
        return 'March';
      case 4:
        return 'April';
      case 5:
        return 'May';
      case 6:
        return 'June';
      case 7:
        return 'July';
      case 8:
        return 'August';
      case 9:
        return 'September';
      case 10:
        return 'October';
      case 11:
        return 'November';
      case 12:
        return 'December';
      default:
        return '';
    }
  }

  const renderDailyData = () => {
    if (!data.daily) {
      return null; // data.daily가 없으면 아무것도 렌더링하지 않음
    }

    return data.daily.map((item) => (
      <div
        className="auto-group-cfqb-NdM"
        key={item.id}
        onClick={() => handleItemClick(item)}
      >
        <p className="yy-mm-dd-daily-u7V">
          {item.day} {emoticonMap[item.emotion]}
        </p>
        <p className="item--2xo">{item.text}</p>
      </div>
    ));
  };

  const handleHomeClick = () => {
    // 홈으로 이동하는 코드를 여기에 추가
    window.location.reload();
  };

  const handleImageClick = (imageUrl, event) => {
    event.stopPropagation(); // Prevent closing the diary when image is clicked
    setModalImage(imageUrl);
    setIsModalOpen(true);
  };

  return (
    <div className="frame" style={{ backgroundColor: 'white' }}>
      <div className="top_fixed">
        <p className="main-logo">
          <span className="main-title">오늘.</span>
          <span className="sub-title">About today</span>
        </p>

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

      <div className="home_content_space">
        <div className="userProfile">
          <img className="userImg" src={Img} />
          <div className="outerSpace">
            <div className="nameSpace">
              <p className="userName">{Name}</p>
              <p className="thisMonthTag">오늘의 일기 해시태그!</p>
            </div>
            <div className="hashTagBox">
              {monthtagList.length > 0 ? (
                monthtagList.slice(0, 6).map((tag, index) => (
                  <p key={index} className="hashTag">
                    {tag}
                  </p>
                ))
              ) : (
                <p className="noTagsMessage">오늘의 일기를 작성해보세요!</p>
              )}
            </div>
          </div>
        </div>

        <div className="calender">
          <div className="top-group">
            <img
              className="left-arrow2"
              src="/home/left-arrow.svg"
              onClick={goToPreviousMonth}
            />
            <p className="month">{` ${getEnglishMonth(
              today.getMonth() + 1
            )} ${currentYear}`}</p>

            <img
              className="right-arrow"
              src="/home/right-arrow.svg"
              onClick={goToNextMonth}
            />
          </div>

          <div className="frame-4990-Y63" id="1:191">
            <div className="days">
              <p className="weekend">SUN</p>
              <p className="weekday">MON</p>
              <p className="weekday">TUE</p>
              <p className="weekday">WED</p>
              <p className="weekday">THU</p>
              <p className="weekday">FRI</p>
              <p className="weekend">SAT</p>
            </div>
            {renderedCalendar}
          </div>
        </div>

        <ins
          className="kakao_ad_area"
          data-ad-unit="DAN-0BEXAiVFagQlv4CF"
          data-ad-width="320"
          data-ad-height="100"
        ></ins>

        {/* 일기 작성 요구하는 최초 블록 */}

        <div className="diaryList">
          {todayDiary && (
            <div
              className="bottom_group_detail"
              onClick={() => setselectOption(true)}
            >
              <div className="todayDiaryRect_detail">
                <div className="detailFrame1">
                  <p className="today_day">{day}</p>
                  <p className="today_month">{currentMonth}</p>
                </div>
                <div className="detailFrame2">
                  <p className="PlzWriteDiary">일기를 작성해주세요.</p>
                </div>
              </div>
            </div>
          )}

          {monthdiaryList
            .slice()
            .reverse()
            .map((data, index) => {
              // 날짜 문자열을 "-"로 분리하여 년, 월, 일을 추출합니다.
              const [diaryyear, diarymonth, diaryday] = data.date.split('-');

              // 년도와 월을 적절한 형식으로 변환합니다.
              const formattedMonth =
                diarymonth < 10 ? diarymonth[1] : diarymonth;

              return (
                <div
                  className={`bottom_group_detail`}
                  key={index}
                  onClick={() => diaryHandleClick(index)}
                >
                  <div className={`todayDiaryRect_detail`}>
                    <div className="detailFrame1">
                      <p className="today_day">{diaryday}</p>
                      <p className="today_month">{formattedMonth}월</p>
                    </div>
                    <div className="detailFrame2">
                      <p className="diary_title">{data.title}</p>
                      <div className="hashTagBox">
                        {data.hashtags.map((hashtag, index) => (
                          <p className="diary_hashtag" key={index}>
                            <span className="hashtag_symbol">#</span>
                            <span className="hashtag_text">{hashtag}</span>
                          </p>
                        ))}
                      </div>
                      {diaryClickedIndex === index && (
                        <div className="detail_box">
                          <p className="detail_contents">{data.text}</p>

                          <div className="imageBox">
                            {data.photoTexts.map((photoText, index) => (
                              <img
                                key={index}
                                src={photoText}
                                alt={`image-${index}`}
                                onClick={(event) =>
                                  handleImageClick(photoText, event)
                                } // Pass event to stop propagation
                                className="thumbnail"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <img
                    className="emotion_icon"
                    src={`/home/emotion/${emotionMap[data.emotion]}.svg`}
                  />
                </div>
              );
            })}
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
      {selectOption && (
        <div className="optionFrame" onClick={() => setselectOption(false)}>
          <div
            className="option1"
            onClick={() => router.push('/aichat')} // 라우터로 페이지 이동
            style={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            채팅일기
          </div>
          <div
            className="option1"
            onClick={() => router.push('/diary')} // 라우터로 페이지 이동
            style={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            직접작성
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <img src={modalImage} alt="Expanded view" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientHome;
