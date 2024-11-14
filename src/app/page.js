"use client";

import Link from 'next/link';
import { useEffect, useState } from "react";
import './login.css';
import './loading.css';
import Router from 'next/router';
import { useRouter } from 'next/navigation'; // next/navigation으로 변경

//use client
function ClientHome() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // Use Next.js router to handle redirection

  const initKakao = () => {
    if (Kakao && !Kakao.isInitialized()) {
      Kakao.init(String(process.env.NEXT_PUBLIC_KAKAO_INIT_KEY));
    }
  }

  const FetchLogin = () => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/member/CheckMember', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          // Redirect to home if the response is successful
          router.replace('/home'); // Next.js client-side transition
        } else {
          // Handle cases where the response is not OK
          console.log('Failed to authenticate member');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error.message);
      });
  };



  useEffect(() => {
    initKakao();
    FetchLogin();
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2초 후에 로딩이 완료되었다고 가정
  }, []);

  const kakaoLoginHandler = async () => {
    Kakao.Auth.authorize({
      redirectUri: process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URI
    });
  }

  if (isLoading) {
    // 페이지 요소들을 불러오는 중일 때 보여줄 내용
    return (
      <div className="background">
        <div className="frame" id="1:2">
          <div className="frame2">
            <p className="title" id="1:13">
              <span className="title-0">오늘</span>
              <span className="circle">.</span>
            </p>
            <div className="spinner-container">
              <div className="spinner_background"></div>
              <div className="spinner"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 페이지 요소들을 모두 불러온 후에 보여줄 내용
  return (
    <div className="LoginFrame" id="1:3">

      <p className="LoginTitle0" id="10:30">
        오늘은 어떤 일이 있었나요?

        <br />
        나의 소중한 하루를 기록하는 일기 플랫폼

      </p>
      <div className="LoginFrame2" id="10:31">
        <div className="LoginTitle1">오늘.<br /></div>

        <div className="LoginTitle3">: About today</div>
      </div>

      {/* <Link href={kakaoLoginLink} class="LoginFrame3"> */}
      <a className="LoginFrame3" onClick={kakaoLoginHandler} style={{ textDecoration: 'none' }}>
        <div className="LoginFrame4">
          <img className="talk-mWd" src="/login/kakaologin.svg" />
          <p className="LoginTitle4" id="10:40">카카오로 시작하기</p>
        </div>
        {/* </Link> */}
      </a>

    </div>

  );
}

export default ClientHome;


