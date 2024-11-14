"use client"

import React, { useEffect, useState, useRef } from "react";
import Draggable from "react-draggable";
import Link from 'next/link';
import html2canvas from 'html2canvas';
import '../editPwd/editPwd.css';

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

            <div className="mid-space">
                <div className="block">
                    <p className="pwdGuide">기존 비밀번호</p>
                    <input type="password" className="wholeSpace" placeholder="기존 비밀번호" />
                </div>
                <div className="block">
                    <p className="pwdGuide">변경할 비밀번호</p>
                    <input type="password" className="wholeSpace" placeholder="변경할 비밀번호" />
                </div>
                <div className="block">
                    <p className="pwdGuide">변경할 비밀번호 확인</p>
                    <input type="password" className="wholeSpace" placeholder="변경할 비밀번호 확인" />
                </div>
            </div>

        </div>
    );
}

export default ClientHome;