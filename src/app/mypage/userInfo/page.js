'use client';

import React, { useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import '../userInfo/userInfo.css';
import { useUnread } from '../../UnreadContext';

function ClientHome() {
  const [alarm, setalarm] = useState(true);
  const { unreadCount } = useUnread();
  const [Name, setName] = useState(null);
  const [Email, setEmail] = useState(null);
  const [Language, setLanguage] = useState('South Korea');

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
        setEmail(data.email);
        setLanguage(data.language);

        console.log(data);
        // 예: 받은 데이터를 화면에 표시하는 등의 작업 수행

        console.log(data.nickname);
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
        <Link href={'/mypage'}>
          <img className="left-arrow" src="/mypage/left-arrow.svg" />
        </Link>
        <div className="mypage-title">
          <span className="mypage-title">내 정보</span>
        </div>
      </div>

      <div className="content_space_userInfo">
        <div className="option-list-box">
          <p className="option-list-box-text">내 앱 및 미디어</p>
        </div>

        <Link href="/mypage/userInfo/plzName" className="deco_none">
          <div className="option-box" id="user-name">
            <span className="option-text">이름</span>
            <div className="flex">
              <span className="option-text-fill">{Name}</span>
              <img className="right-arrow" src="../mypage/right-arrow.svg" />
            </div>
          </div>
        </Link>

        <Link href="/mypage/userInfo/plzLang" className="deco_none">
          <div className="option-box" id="user-phoneNumber">
            <span className="option-text">언어</span>
            <div className="flex">
              <span className="option-text-fill">{Language}</span>
              <img className="right-arrow" src="../mypage/right-arrow.svg" />
            </div>
          </div>
        </Link>

        {/* <Link href="/mypage/userInfo/plzMail" className="deco_none"> */}
        <div className="option-box" id="user-email">
          <span className="option-text">이메일</span>
          <div className="flex">
            <span className="option-text-fill">{Email}</span>
            <img className="right-arrow" src="../mypage/right-arrow.svg" />
          </div>
        </div>
        {/* </Link> */}

        {/* <Link href="/mypage/userInfo/editPwd" className="deco_none"> */}
        <div className="option-box" id="editPwd">
          <span className="option-text">비밀번호 변경</span>
          <div className="flex">
            <span className="option-text-fill">*******</span>
            <img className="right-arrow" src="../mypage/right-arrow.svg" />
          </div>
        </div>
        {/* </Link> */}

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
    </div>
  );
}

export default ClientHome;
