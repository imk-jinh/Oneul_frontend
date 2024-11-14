'use client';

// ClientHome.js
import React, { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import Draggable from 'react-draggable';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import './matching.css';
import Script from 'next/script';

function ClientHome() {
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]); // 메시지 데이터를 관리하는 상태
  const [receivedMessage, setreceivedMessage] = useState(''); // 현재 표시 중인 상대방의 메시지
  const [showExitMessage, setShowExitMessage] = useState(false); // 채팅 종료 메시지 표시 상태
  const [exitMessageClass, setExitMessageClass] = useState(''); // 채팅 종료 메시지 클래스 상태
  const [isMatching, setIsMatching] = useState(false); // 매칭상태
  const [userId, setUserId] = useState('');
  const [matchTagList, setMatchTagList] = useState([]); // 받아온 매치 태그 리스트를 보관
  const [matchedDate, setMatchedDate] = useState(null); // 최초 매칭된 날짜를 받아옴

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
        console.log(data.user_id);
        setUserId(data.user_id);

        // 구독이 완료된 후에 match/matchstart 요청
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/match/matchstart', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Failed to fetch: ${response.status} ${response.statusText}`
              );
            }
            return response.json();
          })
          .then((data) => {
            if (data.text) {
              console.log(data.text);
            } else {
              console.warn("Response does not contain 'text' field");
            }
          })
          .catch((error) => {
            console.error('Failed to fetch data:', error);
          });

        // 예: 받은 데이터를 화면에 표시하는 등의 작업 수행
      })
      .catch((error) => {
        console.error('데이터 가져오기 오류:', error);
      });
  };

  useEffect(() => {
    userinfoFetchData();
  }, []);

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: process.env.NEXT_PUBLIC_Socket_URI,
      onConnect: () => {
        console.log('Connected');

        // 먼저 /topic/public 구독
        stompClient.subscribe('/topic/public', (message) => {
          // 메시지 처리 로직
        });

        // userId가 있을 때 유저 개인 큐 구독
        if (userId) {
          stompClient.subscribe(
            `/user/${userId}/queue/match`,
            (message) => {
              const roomNumber = message.body; // 메시지 처리 로직

              // 뒤로가기 시 채팅방 리스트로 이동
              window.history.pushState(null, '', '/chatList');

              // 새로고침 팝업 없이 바로 이동
              window.location.href = `/userChat?room=${roomNumber}`;
            },
            { id: `${userId}` }
          );
        }
      },
      debug: (str) => {
        console.log(str);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    // 페이지 떠날 때 대기열에서 삭제 요청
    const handleBeforeUnload = (event) => {
      if (userId) {
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/match/cancel', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ userId }),
        }).catch((error) => {
          console.error('대기열에서 삭제 요청 실패:', error);
        });

        // 사용자에게 떠날 때 경고 메시지를 표시하는 브라우저 동작
        // event.preventDefault();
        // event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    const handlePopState = (event) => {
      if (userId) {
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/match/cancel', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ userId }),
        }).catch((error) => {
          console.error('대기열에서 삭제 요청 실패:', error);
        });

        // 사용자에게 떠날 때 경고 메시지를 표시하는 브라우저 동작
        // event.preventDefault();
        // event.returnValue = '';
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      stompClient.deactivate();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [userId]);

  // useEffect(()=> {
  //     setTimeout(() => {
  //         setIsMatching(true);
  //     }, 5000) // 5초 뒤에 상대방과 매칭이 되었다고 가정.
  // }, [])

  // 메세지 보내는 함수 (API 통신 테스트용)

  return (
    <div className="frame" style={{ backgroundColor: isLoading ? '#313131' : '' }}>

      <div className="top_fixed" style={{ backgroundColor: isLoading ? '#313131' : '' }}>
        <Script
          src="//t1.daumcdn.net/kas/static/ba.min.js"
          strategy="lazyOnload"
        />
        <ins
          className="kakao_ad_area"
          data-ad-unit="DAN-StwrP2FQQrzd1iOD"
          data-ad-width="320"
          data-ad-height="50"
        ></ins>
      </div>

      <div className="content_space4">
        <div className="loadingZone" style={{ backgroundColor: '#313131' }}>
          <div>
            <div>
              <p className="matching_ing">매칭 연결 중</p>
            </div>
            <div className="spinnerZone">
              <div className="spinner-background"></div>
              <div className="spinner"></div>
            </div>
            <div>
              <p className="matching_text">잠시 후 유사한 하루를 보낸 사람과 매칭됩니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientHome;
