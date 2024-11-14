'use client';

import React, { useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import axios from 'axios';
import '../plzName/plzName.css';

function ClientHome() {
  const inputRef = useRef(null);
  const [name, setName] = useState('');
  const [state, setState] = useState(false);

  const handleInputClick = () => {
    if (name == '') {
      setName('');
      setState(true);
      inputRef.current.focus();
    }
  };

  const handleDeleteClick = (e) => {
    setName('');
    setState(false);
  };

  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  const handelConfirmClick = async () => {
    try {
      const formData = new FormData();
      formData.append('Name', name);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/member/setName`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        window.location.href = '/mypage/userInfo';
      } else {
        alert('이름 설정 오류');
        console.log('오류!!!!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="frame">
      <div className="profile-space">
        <Link href={'/mypage/userInfo'}>
          <img className="left-arrow" src="/mypage/left-arrow.svg" />
        </Link>
        <div className="mypage-title">
          <span className="mypage-title">내 정보</span>
          <Link href={'/mypage/userInfo'}>
            <span className="submitBtn" onClick={handelConfirmClick}>
              확인
            </span>
          </Link>
        </div>
      </div>
      <div className="guideSpace">
        <div className="plzWriteName">
          오늘.에서 사용할
          <br />
          이름을 입력해주세요.
        </div>
        <div className="nameGuide">
          이름은 공백없이 12자 이하,
          <br />
          기호는 - _ . 만 사용 가능합니다.
        </div>
      </div>

      <div className="nameWriteSpace">
        <input
          ref={inputRef}
          type="text"
          className="fillname"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={handleInputChange}
          onClick={handleInputClick}
        />
      </div>
    </div>
  );
}

export default ClientHome;
