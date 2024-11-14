'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import './choice.css';
import Router from 'next/router';
import axios from 'axios';

//use client
function ClientHome() {
  const [selectedCountry, setSelectedCountry] = useState('South Korea');

  const [countries, setCountries] = useState([
    { name: 'Albania', flagSrc: '/Country/albania.svg' },
    { name: 'Arab World', flagSrc: '/Country/united_arab_emirates_icon_127873.svg' },
    { name: 'Armenia', flagSrc: '/Country/armenia.svg' },
    { name: 'Azerbaijan', flagSrc: '/Country/azerbaijan_icon_127876.svg' },
    { name: 'India', flagSrc: '/Country/india_icon_127891.svg' },
    {
      name: 'Spain (Basque Country and Galicia)',
      flagSrc: '/Country/spain_icon_127825.svg',
    },
    { name: 'Belarus', flagSrc: '/Country/belarus_icon_127834.svg' },
    { name: 'Bangladesh', flagSrc: '/Country/bangladesh_icon_127886.svg' },
    { name: 'Bosnia and Herzegovina', flagSrc: '/Country/bosnia_and_herzegovina_icon_127841.svg' },
    { name: 'Brazil', flagSrc: '/Country/brazil_icon_127818.svg' },
    { name: 'Bulgaria', flagSrc: '/Country/bulgaria_icon_127820.svg' },
    { name: 'China', flagSrc: '/Country/china_icon_127906.svg' },
    { name: 'Croatia', flagSrc: '/Country/croatia_icon_127840.svg' },
    { name: 'Czech Republic', flagSrc: '/Country/czech_republic_icon_127835.svg' },
    { name: 'Denmark', flagSrc: '/Country/denmark_icon_127836.svg' },
    { name: 'Netherlands', flagSrc: '/Country/netherlands_icon_127838.svg' },
    { name: 'Finland', flagSrc: '/Country/finland_icon_127843.svg' },
    { name: 'France', flagSrc: '/Country/france_icon_127830.svg' },
    { name: 'Georgia', flagSrc: '/Country/georgia_icon_127894.svg' },
    { name: 'Germany', flagSrc: '/Country/germany_icon_127822.svg' },
    { name: 'Greece', flagSrc: '/Country/greece_icon_127866.svg' },
    { name: 'Hungary', flagSrc: '/Country/hungary_icon_127853.svg' },
    { name: 'Indonesia', flagSrc: '/Country/indonesia_icon_127902.svg' },
    { name: 'Ireland', flagSrc: '/Country/ieirelandflag_111920.svg' },
    { name: 'Italy', flagSrc: '/Country/italy_icon_127831.svg' },
    { name: 'Japan', flagSrc: '/Country/japan_icon_127900.svg' },
    { name: 'South Korea', flagSrc: '/Country/south_korea_icon_127918.svg' },
    { name: 'Kyrgyzstan', flagSrc: '/Country/kyrgyzstan_icon_127912.svg' },
    { name: 'Latvia', flagSrc: '/Country/latvia_icon_127823.svg' },
    { name: 'Lithuania', flagSrc: '/Country/lithuania_icon_127845.svg' },
    { name: 'North Macedonia', flagSrc: '/Country/macedonia_icon_127869.svg' },
    { name: 'Malta', flagSrc: '/Country/malta_icon_127842.svg' },
    { name: 'Mongolia', flagSrc: '/Country/mongolia_icon_127885.svg' },
    { name: 'Montenegro', flagSrc: '/Country/montenegro_icon_127870.svg' },
    { name: 'Nepal', flagSrc: '/Country/nepal_icon_127919.svg' },
    { name: 'Norway', flagSrc: '/Country/norway_icon_127850.svg' },
    { name: 'Pakistan', flagSrc: '/Country/pakistan_icon_127875.svg' },
    { name: 'Iran', flagSrc: '/Country/iran_icon_127909.svg' },
    { name: 'Poland', flagSrc: '/Country/poland_icon_127852.svg' },
    { name: 'Portugal', flagSrc: '/Country/portugal_icon_127827.svg' },
    { name: 'Romania', flagSrc: '/Country/romania_icon_127849.svg' },
    { name: 'Russia', flagSrc: '/Country/russia_icon_127851.svg' },
    { name: 'Serbia', flagSrc: '/Country/serbia_icon_127829.svg' },
    { name: 'Slovakia', flagSrc: '/Country/slovakia_icon_127846.svg' },
    { name: 'Slovenia', flagSrc: '/Country/slovenia_icon_127847.svg' },
    { name: 'Ukraine', flagSrc: '/Country/ukraine_icon_127856.svg' },
    { name: 'Uzbekistan', flagSrc: '/Country/uzbekistan_icon_127901.svg' },
    { name: 'Vietnam', flagSrc: '/Country/vietnam_icon_127899.svg' },
    { name: 'Wales', flagSrc: '/Country/gbwlswalesflag_111786.svg' },
    { name: 'Yemen', flagSrc: '/Country/yemen_icon_127872.svg' },
  ]);

  const handleCountryClick = (country) => {
    setSelectedCountry(country.name);
    console.log(selectedCountry.name);
  };

  const hadleCountryConfirmClick = async () => {
    try {
      const formData = new FormData();
      formData.append('Language', selectedCountry);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/member/choiceLanguage`,
        formData,
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="frame">
    <div className='top' />
    <Link href="/mypage">
        <img className="backKey" src="/etc/backKey.svg" id="168:131" />
      </Link>
    <div className="frame2">
      <p className="Title" id="168:112">
        여러분의 언어를
        <br />
        선택하세요.
      </p>
    </div>

    <p className="Title2" id="">
      대화 언어
    </p>

    <div
      className="frame3"
      style={{ overflowY: 'scroll', maxHeight: '100%' }}
    >
      {countries.map((country, index) => (
        <div
          key={index}
          className="CountryList"
          onClick={() => handleCountryClick(country)}
        >
          <div className="Line"></div>
          <div className="Contry">
            <img
              className="Country_Img"
              src={country.flagSrc}
              alt={`Flag of ${country.name}`}
            />
            <p className="Country_Title">{country.name}</p>
            {selectedCountry === country.name && (
              <img className="Check" src="/etc/check.svg" alt="Check" />
            )}
          </div>
        </div>
      ))}
      <div className="Line"></div>
    </div>

    <Link href="/mypage" style={{ textDecoration: 'none' }}>
      <div
        className="frame5"
        style={{ textDecoration: 'none' }}
        onClick={hadleCountryConfirmClick}
      >
        <p className="TitleNext">
          확인
        </p>
      </div>
    </Link>
  </div>
);
}

export default ClientHome;
