'use client';  // 클라이언트 컴포넌트로 선언

import React, { useEffect, useState, useRef } from "react";
import Draggable from "react-draggable";
import Link from 'next/link';
import html2canvas from 'html2canvas';
import "./aichat.css";
import { useRouter } from 'next/navigation';  // next/navigation으로 변경
import Script from 'next/script';

function ClientHome() {
    const router = useRouter();  // Next.js의 useRouter를 사용
    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState([]); // 메시지 데이터를 관리하는 상태
    const [aiMessage, setAiMessage] = useState(""); // 현재 표시 중인 AI 메시지
    const aiMessageRef = useRef(""); // AI 메시지 저장을 위한 ref
    const [showExitMessage, setShowExitMessage] = useState(false); // 채팅 종료 메시지 표시 상태
    const [exitMessageClass, setExitMessageClass] = useState(""); // 채팅 종료 메시지 클래스 상태
    const [diaryData, setDiaryData] = useState("");
    const [matchedDate, setMatchedDate] = useState(null); // 최초 매칭된 날짜를 받아옴
    const messagesEndRef = useRef(null); // 스크롤을 위한 ref 추가
    const [isDialogOpen, setIsDialogOpen] = useState(false); // 다이얼로그 상태 추가
    const [dialogMessage, setDialogMessage] = useState(''); // 다이얼로그 메시지 추가
    
    const [today, setToday] = useState(new Date());
    const year = today.getFullYear(); // 연도
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 1을 더하고 두 자리로 포맷)
    const day = String(today.getDate()).padStart(2, '0'); // 일 (두 자리로 포맷)

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1500); // 1.5초 후에 로딩이 완료되었다고 가정
    }, []);

    // 메시지를 보내는 함수 (수정된 함수)
    const sendMessage = async (text, sender) => {
        const newMessage = { text, sender };
        setMessages(prevMessages => [...prevMessages, newMessage]); // 이전 메시지에 새로운 메시지를 추가하여 상태 업데이트
        if (sender === 'mine') {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/gen', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: text,
                        history: messages
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.text();

                setTimeout(() => {
                    showAiResponse(data);
                }, 1000);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const showAiResponse = (responseText) => {
        let index = 0;
        let dotCount = 0;
        setAiMessage(""); // Reset AI message

        const interval = setInterval(() => {
            if (dotCount < 3) {
                setAiMessage(prev => prev + ".");
                dotCount++;
            } else {
                dotCount = 0;
                setAiMessage(prev => "");
            }
        }, 300); // 점을 300ms마다 추가

        setTimeout(() => {
            clearInterval(interval);
            const typingInterval = setInterval(() => {
                if (index < responseText.length) {
                    setAiMessage(prev => prev + responseText[index]);
                    index++;
                } else {
                    clearInterval(typingInterval);
                    setMessages(prevMessages => [...prevMessages, { text: responseText, sender: 'theirs' }]);
                    setAiMessage(""); // 완료되면 초기화
                }
            }, 100);
        }, 2000); // 3초 후부터 실제 메시지 타이핑 시작
    };

    const handleExitClick = async () => {
        setIsDialogOpen(true);
        setShowExitMessage(true);
        try {
            setDialogMessage("일기를 생성 중입니다..")
            // 일기 생성 코드
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/makeDaily', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: "",
                    history: messages
                }),
            });

            if (!response.ok) {
                setDialogMessage("생성 중 오류가 발생하였습니다.")
                setTimeout(() => {
                    setIsDialogOpen(false); // 다이얼로그 닫기
                }, 3000); // 잠시 대기 후 다이얼로그 닫기
                throw new Error('Network response was not ok');
            }

            const data = await response.text();

            // 감정 분석 코드
            const emotionResponse = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/predictEmotion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    diary: data
                }),
            });

            if (!emotionResponse.ok) {
                throw new Error('Emotion response was not ok');
            }

            const emotionData = await emotionResponse.text();

            router.replace(`/diary?diary=${encodeURIComponent(data)}&emotion=${encodeURIComponent(emotionData)}`);

        } catch (error) {
            setDialogMessage("생성 중 오류가 발생하였습니다.")
            setTimeout(() => {
                setIsDialogOpen(false); // 다이얼로그 닫기
            }, 3000); // 잠시 대기 후 다이얼로그 닫기
            console.error('Error:', error);
        }
    };

    // 메시지가 업데이트될 때 자동으로 스크롤
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="frame">
            <div className="top_fixed">
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
            <div>
                <div className="top_group">
                <span className="aichat_date">{`${year}. ${month}. ${day}` }</span>
                    <span className="title">채팅 일기 </span>
                    <span className="aichat_exit" onClick={handleExitClick}>채팅 종료</span>
                </div>
                <div className="top_line"></div>
            </div>


            <div className="content_space">
                {isDialogOpen && (
                    <div className="dialog">
                        <p>{dialogMessage}</p>
                    </div>
                )}
                {/* 로딩 구현 */}
                {isLoading ? (
                    <div className="loadingZone">
                        <div className="spinnerZone">

                            <div className="spinner-background"></div>
                            <div className="spinner"></div>
                        </div>
                    </div>
                ) : (
                    <Draggable>
                        <div className="message-container">
                            {/* 메시지들을 표시하는 부분 */}
                            {messages.map((message, index) => (
                                <div key={index} className={`message ${message.sender}`}>{message.text}</div>
                            ))}
                            {/* AI 메시지가 타이핑되는 부분 */}
                            {aiMessage && <div className="message theirs">{aiMessage}</div>}
                            <div ref={messagesEndRef} />
                        </div>
                    </Draggable>
                )}

                <div className="bottom_line3">
                    <div className="bottomChatUI">
                        <div className="sendMessage_Space">
                            <input
                                className="sendText"
                                type="text"
                                placeholder="보낼 메시지를 입력하세요"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        sendMessage(e.target.value, 'mine');
                                        e.target.value = ''; // 입력 창 비우기
                                        e.preventDefault(); // 기본 동작 중단
                                    }
                                }}
                            />
                        </div>
                        <div className="circle-border">
                            <img src="/aichat/selectImg.svg" className="selectImg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientHome;
