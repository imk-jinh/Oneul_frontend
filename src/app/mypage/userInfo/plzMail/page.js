"use client"

import React, { useEffect, useState, useRef } from "react";
import Draggable from "react-draggable";
import Link from 'next/link';
import html2canvas from 'html2canvas';
import '../plzMail/plzMail.css';

function ClientHome() {
    return (
        <div className="frame">
            <div className="profile-space">
                <Link href={'/mypage/userInfo'}>
                    <img className="left-arrow" src="/mypage/left-arrow.svg" />
                </Link>
                <div className="mypage-title">
                    <span className="mypage-title">내 정보</span>
                    <span className="submitBtn">확인</span>
                </div>
            </div>
            <div className="guideSpace">
                <div className="plzWriteName">
                    오늘.에서 사용할<br />
                    이메일을 입력해주세요.
                </div>
            </div>
            <div className="mid-space">
                <input type="email" className="wholeSpace" placeholder="이메일 입력" />
                <div className="container6">
                    <span className="gmailCom">
                        @ gmail.com
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ClientHome;