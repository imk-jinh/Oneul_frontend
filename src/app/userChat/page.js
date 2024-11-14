"use client";

import React, { useEffect, useState, useRef, useContext } from "react";
import { useSearchParams } from "next/navigation";
import "./userChat.css";
import { ChatContext } from "../ChatContext";
import { Client } from '@stomp/stompjs';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

function ClientHome() {
    const searchParams = useSearchParams();
    const { room, setRoom, myId, otherRoomMessages, setOtherRoomMessages } =
        useContext(ChatContext);
    const router = useRouter();
    const [user, setUser] = useState("");
    const [name, setName] = useState("");
    const [profile, setProfile] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [today, setToday] = useState(new Date());
    const year = today.getFullYear(); // 연도
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 1을 더하고 두 자리로 포맷)
    const day = String(today.getDate()).padStart(2, '0'); // 일 (두 자리로 포맷)

    const messagesEndRef = useRef(null);
    const initialLoadRef = useRef(true);
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



    useEffect(() => {
        loadKakaoAds();
    }, [router.pathname]);

    useEffect(() => {
        setRoom(searchParams.get("room"));
    }, [searchParams]);

    useEffect(() => {
        const fetchAllData = async () => {
            if (room) {
                setIsLoading(true);
                await fetchRoomData();
                await fetchChats();
                await fetchReadMessage();
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, [room]);

    useEffect(() => {
        const stompClient = new Client({
            brokerURL: process.env.NEXT_PUBLIC_Socket_URI,
            onConnect: () => {
                stompClient.subscribe(`/user/${myId}/queue/message`, (message) => {
                    const data = JSON.parse(message.body);
                    if (String(data.roomId) === String(room)) {
                        setMessages(prevMessages => [...prevMessages, data]);
                        fetchReadMessage();
                    } else {
                        setOtherRoomMessages(data);
                    }
                });
            },
            debug: (str) => {
                console.log(str);
            },
        });
        stompClient.activate();
        return () => stompClient.deactivate();
    }, [myId, room]);

    const fetchReadMessage = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/userchat/readAllMessages`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        room: room,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch: ${response.status} ${response.statusText}`
                );
            }
        } catch (error) {
            console.error("Failed to fetch chats:", error);
        }
    };

    const fetchRoomData = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/userchat/getRoom`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        room: room,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();
            setUser(data.user);
            setName(data.name);
            setProfile(data.profile);
        } catch (error) {
            console.error("Failed to fetch chats:", error);
        }
    };

    const fetchChats = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/userchat/get`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        room: room,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch: ${response.status} ${response.statusText}`
                );
            }

            const chats = await response.json();

            setMessages((prevMessages) => {
                const newChats = chats.filter(
                    (chat) =>
                        !prevMessages.some((message) => message.chatId === chat.chatId)
                );
                return [...prevMessages, ...newChats];
            });
        } catch (error) {
            console.error("Failed to fetch chats:", error);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, [isLoading]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (text, sender) => {
        const newMessage = { text, sender };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_BACKEND_URL + "/userchat/send",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: text,
                        room: room,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleExitClick = () => {
        router.replace("/chatList");
    };

    return (
        <div className="frame">
            <div className="top_fixed">
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
            <div className="userChatFixed">

                <div className="top_group_userChat">
                <span className="aichat_date">{`${year}. ${month}. ${day}` }</span>
                    <span className="title">{name}</span>
                    <span className="aichat_exit" onClick={handleExitClick}>
                        채팅 종료
                    </span>
                </div>
                <div className="top_line_userChat"></div>
            </div>

            <div className="content_space">
                {isLoading ? (
                    <div id="spinner-container" className="spinner-container">
                        <div className="spinner-background"></div>
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="message-container2">
                        <div className="message-container">
                            <div className="message-container-top_gap" />
                            {messages.map((message, index) => {
                                const isSameSenderAsPrevious =
                                    index > 0 && messages[index - 1].sender === message.sender;

                                return (
                                    <React.Fragment key={index}>
                                        {message.sender && String(message.sender) !== String(user) ? (
                                            !isSameSenderAsPrevious ? (
                                                <div className="message mine">
                                                    <div className="text">{message.text}</div>
                                                </div>
                                            ) : (
                                                <div className="message mine2">
                                                    <div className="text">{message.text}</div>
                                                </div>
                                            )
                                        ) : (
                                            <div className="otherMessage">
                                                {!isSameSenderAsPrevious ? (
                                                    <img
                                                        src={profile}
                                                        alt="User Profile Image"
                                                        className="userImg_left"
                                                    />
                                                ) : (
                                                    <div className="userImg_placeholder"></div>
                                                )}

                                                <div className="otherMessage2">
                                                    {!isSameSenderAsPrevious && (
                                                        <div className="otherMessageName">{name}</div>
                                                    )}

                                                    {!isSameSenderAsPrevious ? (
                                                        <div className="message theirs">
                                                            <div className="text">{message.text}</div>
                                                        </div>
                                                    ) : (
                                                        <div className="message theirs2">
                                                            <div className="text">{message.text}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                )}
            </div>

            <div className="bottom_line2">
                <div className="bottomChatUI">
                    <div className="sendMessage_Space">
                        <input
                            className="sendText"
                            type="text"
                            placeholder="보낼 메시지를 입력하세요"
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage(e.target.value, myId);
                                    e.target.value = "";
                                    e.preventDefault();
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
    );
}

export default ClientHome;
