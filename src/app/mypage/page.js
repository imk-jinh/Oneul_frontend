'use client';

import React, { useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import '../mypage/mypage.css';
import { useUnread } from '../UnreadContext';

function ClientHome() {
  const [showOptions, setShowOptions] = useState(false);
  const [alarm, setalarm] = useState(true);
  const [Name, setName] = useState(false);
  const [Img, setImg] = useState(['/login/basicImg.svg']);
  const [writtenDiary, setWrittenDiary] = useState(0); // 쓴 일기
  const [savedpoetry, setSavedpoetry] = useState(0); // 저장된 시
  const [chatMatching, setChatMatching] = useState(0); // 채팅 매칭
  const { unreadCount } = useUnread();

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const userinfoFetchData = () => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/myPage/getInfo', {
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
        console.log(data);
        setName(data.name);
        setImg(data.img);
        setWrittenDiary(data.diaryCount);
        setSavedpoetry(data.poetryCount);
        setChatMatching(data.chatCount);
        // 예: 받은 데이터를 화면에 표시하는 등의 작업 수행
      })
      .catch((error) => {
        console.error('데이터 가져오기 오류:', error);
      });
  };

  useEffect(() => {
    userinfoFetchData();
  }, []);

  return (
    <div className="frame">
      <div className="profile-space">
        <Link href={'/home'}>
          <img className="left-arrow" src="mypage/left-arrow.svg" />
        </Link>
        <div className="mypage-title">
          <span className="mypage-title">마이페이지</span>
        </div>
      </div>
      <div className="top-space">
        <div className="dd">
          <div>
            <img className="userProfile-img" src={Img}></img>
            <img
              className="editIcon"
              src="../mypage/editIcon.svg"
              onClick={toggleOptions}
            ></img>
            {showOptions && (
              <div className="option-stack">
                <div className="option-stack-text">사진보관함</div>
                <div className="sperate-line"></div>
                <div className="option-stack-text">사진 찍기</div>
                <div className="sperate-line"></div>
                <div className="option-stack-text">파일 선택</div>
              </div>
            )}
          </div>

          <div>
            <div className="user-name">{Name}</div>
            <Link href="/mypage/userInfo" className="decoLine_X">
              <div className="edit-myInfo">내 정보 관리</div>
            </Link>
          </div>
        </div>



        <div className="diary_State-box">
          <div className="writed-diary">
            <div className="diary-count">{writtenDiary}</div>
            <span className="diary-count-text">쓴 일기</span>
          </div>
          <div className="diary-line1"></div>
          <div className="saved-poem-box">
            <div className="saved-poem-count">{savedpoetry}</div>
            <span className="saved-poem-text">저장된 시</span>
          </div>
          <div className="diary-line2"></div>
          <div className="matching-count-box">
            <div className="matching-count">{chatMatching}</div>
            <span className="matching-count-text">채팅매칭</span>
          </div>
        </div>
      </div>

      <div className='content_space_mypage'>

        <div className="option-list-box">
          <p className='option-list-box-text'>내 앱 및 미디어</p>
        </div>

        <Link href="/mypage/choiceLanguage" className="decoLine_X">
          <div className="option-box" id="language">
            <span className="option-text">언어</span>
            <img className="right-arrow" src="../mypage/right-arrow.svg" />
          </div>
        </Link>

        <div className="option-box" id="darkmode">
          <span className="option-text">다크모드</span>
          <img className="right-arrow" src="../mypage/right-arrow.svg" />
        </div>

        <div className="option-box" id="saved">
          <span className="option-text">저장됨</span>
          <img className="right-arrow" src="../mypage/right-arrow.svg" />
        </div>

        <div className="option-box" id="notification">
          <span className="option-text">알림</span>
          <img className="right-arrow" src="../mypage/right-arrow.svg" />
        </div>

        <div className="option-list-box" id="separateLine">
          <p className='option-list-box-text'>
            더 많은 정보 및 지원
          </p>

        </div>
        <div className="option-box" id="customer-service">
          <span className="option-text">고객센터</span>
          <img className="right-arrow" src="../mypage/right-arrow.svg" />
        </div>

        <div className="option-box" id="report-issue">
          <span className="option-text">문제신고</span>
          <img className="right-arrow" src="../mypage/right-arrow.svg" />
        </div>

        <div className="option-box" id="faq-section">
          <span className="option-text">자주 묻는 질문</span>
          <img className="right-arrow" src="../mypage/right-arrow.svg" />
        </div>

        <div className="option-list-box" id="separateLine">
          <p className='option-list-box-text'>
            계정
          </p>
        </div>
        <div className="option-box" id="delete-user">
          <span className="option-text">회원탈퇴</span>
          <img className="right-arrow" src="../mypage/right-arrow.svg" />
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
