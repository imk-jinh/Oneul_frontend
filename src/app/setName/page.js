'use client';

import { useEffect, useState } from 'react';
import './setName.css';
import Link from 'next/link';
import { useRef } from 'react';
import axios from 'axios';

//use client
export default function ClientHome() {
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
        window.location.href = '/selectImg';
      } else {
        alert('이름 설정 오류');
        console.log('오류!!!!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 페이지 요소들을 모두 불러온 후에 보여줄 내용
  return (
    <div className="setNameFrame">
      <div className='top' />
      <Link href="/choiceLanguage">
        <img className="backKey" src="/etc/backKey.svg" />
      </Link>
      <p className="setNameTitle">
        오늘.에서 사용할
        <br />
        이름을 입력해주세요.
      </p>
      <p className="nameGuide">
        <span className="guide1">이름은 </span>
        <span className="guide2">공백없이 </span>
        <span className="guide3">
          12자 이하,
          <br />
          기호는 - _ . 만 사용 가능합니다.
        </span>
      </p>

      <div className="nameSpace">
        <div className="nameInner">
          {!state && (
            <p className="placeholder" onClick={handleInputClick}>
              이름을 입력해주세요.
            </p>
          )}
          <input
            ref={inputRef}
            className="input"
            type="text"
            value={name}
            onChange={handleInputChange}
            onClick={handleInputClick}
          />
        </div>
        <img
          className="delete"
          src="/etc/delete_0.svg"
          onClick={handleDeleteClick}
          alt="Delete"
        />
      </div>

      <Link href="/selectImg" style={{ textDecoration: 'none' }}>
        <div
          className="confirm"
          onClick={handelConfirmClick}
        >
          <div className='TitleNext'>
            확인
          </div>

        </div>
      </Link>
    </div >
  );
}
