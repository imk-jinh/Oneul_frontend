'use client';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import './selectImg.css';
import { useRouter } from 'next/router';

function ClientHome() {
  const [selectedImage, setSelectedImage] = useState('/login/basicImg.svg');
  const [fixedImage, setFixedImage] = useState('/login/basicImg.svg');
  const [showModal, setShowModal] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [initialTouches, setInitialTouches] = useState(null);
  const [scale, setScale] = useState(1);
  const [name, setName] = useState('');

  const imageRef = useRef(null);

  useEffect(() => {
    fetchName();
  }, []);

  const fetchName = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/home/gethomeuserinfo`,
        {
          withCredentials: true,
        }
      );
      setName(response.data.nickname);
    } catch (error) {
      console.error('Failed to fetch name:', error);
    }
  };

  const handleTouchStart = (event) => {
    if (event.touches.length === 2) {
      const [touch1, touch2] = event.touches;
      setInitialTouches({
        x1: touch1.clientX,
        y1: touch1.clientY,
        x2: touch2.clientX,
        y2: touch2.clientY,
      });
    } else {
      const touch = event.touches[0];
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchMove = (event) => {
    if (event.touches.length === 2 && initialTouches) {
      // 두 손가락으로 줌 처리
      const [touch1, touch2] = event.touches;
      const newDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const initialDistance = Math.hypot(
        initialTouches.x2 - initialTouches.x1,
        initialTouches.y2 - initialTouches.y1
      );
      const newScale = scale + (newDistance - initialDistance) / 10000;
      setScale(newScale < 1 ? 1 : newScale);
    } else if (event.touches.length === 1) {
      // 한 손가락으로 드래그 처리
      if (!touchStart.x || !touchStart.y) return;

      const touch = event.touches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;

      // 이미지의 실제 크기 가져오기
      const imgElement = document.querySelector('.modal-image2');
      const naturalWidth = imgElement.naturalWidth;
      const naturalHeight = imgElement.naturalHeight;

      // 컨테이너 크기는 스케일을 곱하지 않습니다.
      const container = document.querySelector('.overlay2');
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      const scaleX = naturalWidth / containerWidth;
      const scaleY = naturalHeight / containerHeight;
      const finalScale = scale / Math.min(scaleX, scaleY);

      const imgWidth = naturalWidth * finalScale;
      const imgHeight = naturalHeight * finalScale;




      // 이미지가 컨테이너보다 클 경우만 이동 가능하게 제한
      const minX = -Math.min(0, containerWidth - imgWidth) / 2;  // 이미지가 왼쪽으로 갈 수 있는 최소 값
      const maxX = Math.max(0, containerWidth - imgWidth) / 2;  // 이미지가 오른쪽으로 갈 수 있는 최대 값
      const minY = -Math.min(0, imgHeight - containerHeight) / 2;  // 이미지가 위로 갈 수 있는 최소 값
      const maxY = Math.max(0, imgHeight - containerHeight) / 2;  // 이미지가 아래로 갈 수 있는 최대 값


      // 새로운 위치 계산 (범위 내로 제한)
      const newPosition = {
        x: Math.max(minX, Math.min(imagePosition.x - deltaX, maxX)),
        y: Math.max(minY, Math.min(imagePosition.y - deltaY, maxY)),
      };

      // 위치 업데이트
      setImagePosition(newPosition);
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    }
  };

  // 이미지 변경 처리
  const handleImageChange = (event) => {
    try {
      const selectedFile = event.target.files[0];
      if (!selectedFile) return; // 파일이 선택되지 않은 경우 예외 처리

      // 파일 선택 초기화 (같은 파일을 선택해도 이벤트가 발생하도록)
      event.target.value = null; // input의 값을 리셋하여 같은 파일 선택 가능하게 함

      const imageUrl = URL.createObjectURL(selectedFile);

      const img = new Image();
      img.onload = () => {
        setSelectedImage(img);
        openModal(); // 항상 모달이 열리도록 처리
      };
      img.onerror = () => {
        console.error('이미지 로드 실패');
        alert('이미지 로드에 실패했습니다. 다른 이미지를 선택해 주세요.');
      };
      img.src = imageUrl;
    } catch (error) {
      console.error('이미지 선택 중 오류:', error);
    }
  };


  // 모달 닫기 및 상태 초기화
  const closeModal = () => {
    setShowModal(false);
    setSelectedImage('/login/basicImg.svg'); // 기본 이미지로 리셋
  };

  const openModal = () => {
    setImagePosition({ x: 0, y: 0 });
    setScale(1);
    setShowModal(true);
  };

  const handleCapture = async () => {
    try {
      const container = document.querySelector('.overlay2'); // 이미지가 포함된 컨테이너
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      // 다이얼로그에 보이는 영역의 크기와 비율을 캡처
      const containerWidth = container.offsetWidth;
      const containerHeight = containerWidth; // 정사각형 비율을 유지

      canvas.width = containerWidth;
      canvas.height = containerHeight;

      // 이미지 가져오기
      const imgElement = document.querySelector('.modal-image2');
      const img = new Image();
      img.src = imgElement.src;

      img.onload = () => {
        const scaleX = img.naturalWidth / containerWidth;
        const scaleY = img.naturalHeight / containerHeight;
        const finalScale = scale / Math.min(scaleX, scaleY);

        const scaledWidth = img.naturalWidth * finalScale;
        const scaledHeight = img.naturalHeight * finalScale;

        const offsetX = (containerWidth - scaledWidth) / 2 - imagePosition.x;
        const offsetY = (containerHeight - scaledHeight) / 2 - imagePosition.y;

        context.drawImage(
          img,
          offsetX,
          offsetY,
          scaledWidth,
          scaledHeight
        );

        // Blob으로 변환하여 상태에 저장
        canvas.toBlob((blob) => {
          setFixedImage(URL.createObjectURL(blob));
        }, 'image/jpeg', 0.8);

        closeModal(); // 모달 닫기
      };
    } catch (error) {
      console.error('이미지 캡처 중 오류:', error);
    }
  };

  // 최종 이미지 서버에 업로드
  const handelSubmit = async () => {
    try {
      // 이미지를 설정하지 않았으면 null을 전송
      if (fixedImage === '/login/basicImg.svg') {
        const uploadResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/member/setImgNull`,
          {}, // 빈 객체를 사용해 폼데이터를 전송하지 않음
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json', // multipart/form-data가 아닌 일반 JSON 요청
            },
          }
        );
        console.log(uploadResponse.data);
        window.location.href = '/home'; // 업로드 성공 후 홈으로 이동
        return;
      }


      const response = await fetch(fixedImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('imgs', blob, 'profile.jpg');

      const uploadResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/member/setImg`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(uploadResponse.data);
      window.location.href = '/home'; // 업로드 성공 후 홈으로 이동
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };


  return (
    <div className="frame0">
      <Link href="/setName">
        <img className="backKey" src="/etc/backKey.svg" />
      </Link>
      <div className='content_space_selImg'>
        <p className="Title0">
          오늘.에서 사용할
          <br />
          프로필을 선택해주세요.
        </p>
        <p className="Title1">
          친구가 나를 알아보기 쉽게
          <br />
          사진을 선택해주세요!
        </p>
        <div className='imgcenter'>
          <div className="frame1">
            <label htmlFor="imageInput" className='imgdiv'>
              <img className="userImg" src={fixedImage} />
            </label>
            <input
              type="file"
              accept="image/*"
              id="imageInput"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
          <div className="Name">
            {name ? name : 'Error'}
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-container" id="233:60">
              <div className="modal-header" id="QhBFMHdnSf8Sh7KppZ1zeq">
                <div
                  className="modal-btn-cancel"
                  onClick={closeModal}
                >
                  취소
                </div>
                <p className="modal-btn-library">
                  라이브러리
                </p>
                <div
                  className="modal-btn-done"
                  onClick={handleCapture}
                >
                  완료
                </div>
              </div>
              <div className='image-section'>
                <div
                  className="image-container"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                >
                  <div className="overlay2">
                    <img
                      className="modal-image2"
                      ref={imageRef}
                      src={selectedImage.src}
                      style={{
                        objectFit: 'cover',
                        objectPosition: `calc(50% - ${imagePosition.x}px) calc(50% - ${imagePosition.y}px)`, // 반대 방향으로 설정
                        transform: `scale(${scale})`,
                      }}
                    />
                  </div>
                  <div className="overlay"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className="confirm"
          onClick={handelSubmit}
        >
          <div className='TitleNext'>
            확인
          </div>

        </div>
      </div>
    </div>
  );
}

export default ClientHome;



