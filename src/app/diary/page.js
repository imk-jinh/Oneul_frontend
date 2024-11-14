'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './diary.css';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useUnread } from '../UnreadContext';
import { useRouter } from 'next/navigation'; // next/navigation으로 변경

export default function Diary() {
  const [currentMonth, setCurrentMonth] = useState('');
  const [alarm, setalarm] = useState(true);
  const [today, setToday] = useState(new Date());
  const [previews, setPreviews] = useState([]); // previews 상태 추가 - 이미지 업로드 미리보기
  const [fixedImage] = useState('/home/basicDiaryImg.svg'); // 이미지 업로드 버튼 이미지
  const [images, setImages] = useState([]); // images 상태 추가
  const contentareaRef = useRef(null); // 일기 내용 길이
  const [diaryContent, setDiaryContent] = useState(''); // 일기 내용 상태 추가
  const [diaryTitle, setDiaryTitle] = useState(''); // 일기 타이틀 상태 추가
  const [diaryTag, setDiaryTag] = useState(''); // 일기 태그 입력 상태 추가
  const [tags, setTags] = useState([]); // 여러 태그를 관리하는 상태 추가
  const [fixedDeleteImg] = useState('/home/delete.svg'); // 업로드 이미지 삭제 버튼
  const [warning, setWarning] = useState(''); // 경고 메시지 상태 추가
  const [showEmoticons, setShowEmoticons] = useState(false); // 이모티콘 펼침 상태 추가
  const { unreadCount } = useUnread();
  const [isDialogOpen, setIsDialogOpen] = useState(false); // 다이얼로그 상태 추가
  const [dialogMessage, setDialogMessage] = useState(''); // 다이얼로그 메시지 추가
  const router = useRouter(); // Next.js의 useRouter를 사용

  // 이모티콘 이미지를 딕셔너리 형태로 관리
  const emoticonImages = {
    행복: '/home/emotion/happy.svg',
    화남: '/home/emotion/angry.svg',
    싫음: '/home/emotion/hate.svg',
    기본: '/home/emotion/normal.svg',
    슬픔: '/home/emotion/sad.svg',
    공포: '/home/emotion/scary.svg',
    놀람: '/home/emotion/suprise.svg',
  };
  // 선택한 감정 이모티콘을 문자열로 관리 (기본 값: "기본")
  const [selectedEmoticon, setSelectedEmoticon] = useState('기본');
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);

  const month = String(today.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 1을 더하고 두 자리로 포맷)
  const day = String(today.getDate()).padStart(2, '0'); // 일 (두 자리로 포맷)

  const searchParams = useSearchParams();
  const diary = searchParams.get('diary');
  const ai_emoticon = searchParams.get('emotion');

  useEffect(() => {
    if (diary) {
      try {
        setDiaryContent(decodeURIComponent(diary));
        console.log(diary);
        console.log(ai_emoticon);
      } catch (e) {
        console.error('Failed to decode diary:', e);
      }
    }
  }, [diary]);

  useEffect(() => {
    // 현재 월 설정
    setCurrentMonth(today.toLocaleString('default', { month: 'short' }));
  }, [today]);

  useEffect(() => {
    // 컴포넌트가 렌더링된 후 textarea 높이 조정
    const textArea = contentareaRef.current;
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = textArea.scrollHeight + 'px';
    }
  }, [diaryContent]);

  const handleImageChange = (e) => {
    const newImages = [...images];
    const newPreviews = [...previews];

    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      if (newImages.length < 3) {
        newImages.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          setPreviews(newPreviews);
        };
        reader.readAsDataURL(file);
      }
    }
    setImages([...newImages]);
  };

  const handleDeletePreview = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleDiaryContentChange = (e) => {
    setDiaryContent(e.target.value);
    if (contentareaRef && contentareaRef.current) {
      contentareaRef.current.style.height = 'auto';
      contentareaRef.current.style.height =
        contentareaRef.current.scrollHeight + 'px';
    }
    if (e.target.value.trim() !== '') {
      setContentError(false);
    }
  };

  const handleDiaryTitleChange = (e) => {
    setDiaryTitle(e.target.value);
    if (e.target.value.trim() !== '') {
      setTitleError(false);
    }
  };

  const handleDiaryTagChange = (e) => {
    setDiaryTag(e.target.value);
    if (tags.length >= 3) {
      setWarning('태그는 최대 3개까지 추가할 수 있습니다.');
    } else {
      setWarning('');
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && diaryTag.trim() !== '') {
      if (tags.length < 3) {
        setTags([...tags, diaryTag.trim()]);
        setDiaryTag('');
        setWarning(''); // 태그 추가 시 경고 메시지 초기화
      } else {
        setWarning('태그는 최대 3개까지 추가할 수 있습니다.');
      }
      e.preventDefault(); // To prevent the Enter key from adding a newline in the textarea
    }
  };

  const handleTagDelete = (index) => {
    setTags(tags.filter((_, i) => i !== index));
    setWarning(''); // 태그 삭제 시 경고 메시지 초기화
  };

  // 이모티콘 선택 함수
  const handleEmoticonSelect = (emotionKey) => {
    setSelectedEmoticon(emotionKey); // 이모티콘 키(예: "행복")를 선택 상태로 설정
    setShowEmoticons(false); // 이모티콘 선택 후 닫기
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diaryTitle.trim() || !diaryContent.trim()) {
      setIsDialogOpen(true);
      setDialogMessage('일기 제목과 일기 내용을 모두 입력하세요.');
      setTimeout(() => {
        setIsDialogOpen(false); // 다이얼로그 닫기
      }, 1500); // 잠시 대기 후 다이얼로그 닫기
      return;
    }

    if (tags.length > 3) {
      alert('태그는 최대 3개까지만 추가할 수 있습니다.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('Title', diaryTitle);
      formData.append('Date', today.toISOString());

      // JSON 문자열 대신 배열 형태로 전송
      tags.forEach((tag) => {
        formData.append('Tag', tag);
      });

      formData.append('Emotion', selectedEmoticon);
      formData.append('Text', diaryContent);
      images.forEach((image) => {
        formData.append('imgs', image);
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/diary/addDiary`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        setDialogMessage('일기 항목이 성공적으로 추가되었습니다!');
        setTimeout(() => {
          router.replace("/home");
        }, 1500); // 잠시 대기 후 리다이렉션
      } else {
        setDialogMessage('일기 항목 추가 중 오류가 발생하였습니다.');
        setTimeout(() => {
          setIsDialogOpen(false); // 다이얼로그 닫기
        }, 1500); // 잠시 대기 후 다이얼로그 닫기
      }
    } catch (error) {
      console.error('Error adding diary:', error);
      setDialogMessage('일기 항목 추가 중 오류가 발생했습니다.');
      setTimeout(() => {
        setIsDialogOpen(false); // 다이얼로그 닫기
      }, 1500); // 잠시 대기 후 다이얼로그 닫기
    }
  };

  // 감정 이모티콘 펼침/접힘 토글 함수
  const toggleEmoticons = () => {
    setShowEmoticons(!showEmoticons);
  };

  const handleExitClick = () => {
    router.replace("/home")
  };

  return (
    <div className="frame">
      <div className="top_fixed2">
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
      <div className="profile-space">
        <img className="left-arrow3" onClick={handleExitClick} src="mypage/left-arrow.svg" />
        <div className="mypage-title">
          <span className="mypage-title"> 뒤로가기 </span>
        </div>
      </div>

      <div className='wrap'>
        <div className="content_space1">
          <img className="shareIcon1" src="/writePage/shareIcon.svg" />

          {/* 선택된 이모티콘을 이미지로 표시 */}
          <img
            className="emotion_select1"
            src={emoticonImages[selectedEmoticon]} // 선택된 이모티콘의 이미지 경로로 설정
            onClick={toggleEmoticons}
          />

          {showEmoticons && (
            <div className="emoticon_select1">
              {Object.keys(emoticonImages).map((emotionKey, index) => (
                <img
                  key={index}
                  src={emoticonImages[emotionKey]}
                  className={`emoticon-item ${selectedEmoticon === emotionKey ? 'selectedEmotiicon' : ''
                    }`}
                  onClick={() => handleEmoticonSelect(emotionKey)} // 이모티콘 선택 시 문자열 키 전달
                />
              ))}
            </div>
          )}

          <div className="innerSpace1">
            <div className="top_group1">
              <div className="blockleft">
                <p className="Today_day">{day}</p>
                <p className="Today_month">{currentMonth}</p>
              </div>
              <div className="blockRight">
                <p className="diary_title1">
                  <textarea
                    className="diary_setTitle"
                    value={diaryTitle}
                    onChange={handleDiaryTitleChange}
                    placeholder="제목을 입력하세요."
                  />
                </p>
                <p className="diary_hashtag1">
                  <textarea
                    className="diary_setHashtag"
                    value={diaryTag}
                    onChange={handleDiaryTagChange}
                    onKeyDown={handleTagKeyDown}
                    placeholder="태그를 입력하세요"
                  />
                </p>
                <div className="tag_list">
                  {tags.map((tag, index) => (
                    <span key={index} className="tag_item">
                      {tag}
                      <button
                        type="button"
                        className="tag_delete_button"
                        onClick={() => handleTagDelete(index)}
                      >
                        X
                      </button>
                    </span>
                  ))}
                </div>
                {warning && <p className="warning_message">{warning}</p>}{' '}
                {/* 경고 메시지 출력 */}
                <div className="text_space1" contentEditable="true" >
                  <textarea
                    className="diary_textarea1"
                    ref={contentareaRef}
                    value={diaryContent}
                    onChange={handleDiaryContentChange}
                    placeholder="일기 내용을 입력하세요."
                  />
                </div>
                <div className="imageBox1">
                  <div className="imgBoxContainer">
                    {previews &&
                      previews.map((preview, index) => (
                        <div className="imgBox" key={index}>
                          <Image
                            src={preview}
                            width={100}
                            height={100}
                            alt={`${preview}-${index}`}
                          />
                          <img
                            src={fixedDeleteImg}
                            width={20}
                            height={20}
                            className={styles.deleteImg}
                            onClick={() => handleDeletePreview(index)}
                          />
                        </div>
                      ))}
                    <label className="inputFile" htmlFor="inputFile">
                      {previews.length < 3 && <img className="image_input" src={fixedImage} />}
                    </label>
                    <input
                      type="file"
                      id="inputFile"
                      accept="image/*"
                      style={{ display: 'none' }}
                      multiple
                      className={styles.imageForm}
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="parent">
              <button className="btn_submit" onClick={handleSubmit}>
                <img
                  className="writeComplete1"
                  src="/writePage/writeComplete.svg"
                />
                <div className="writeComplete_text1">작성 완료</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="dialog">
          <p>{dialogMessage}</p>
        </div>
      )}


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
