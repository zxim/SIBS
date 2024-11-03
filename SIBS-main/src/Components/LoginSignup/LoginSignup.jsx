import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginSignup.css';
import crypto from 'crypto-js';
import { useMutation, useLazyQuery } from '@apollo/client';
import { INSERT_USER_INFO, GET_ONE_USER } from '../../Query/query';
import { googleOAuthHandler, fetchGoogleUserData } from './LoginGoogle';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import birthday_icon from '../Assets/birthday.png';
import logo_img from '../Assets/logo.png';
import chatting_img from '../Assets/chatting.png';
import minigame1_img from '../Assets/vote.png';
import minigame2_img from '../Assets/roulette.png';
import signup_google from '../Assets/signup_google.png';
import login_google from '../Assets/login_google.png';
import signup_naver from '../Assets/signup_naver.png';
import login_naver from '../Assets/login_naver.png';
import signup_kakao from '../Assets/signup_kakao.png';
import login_kakao from '../Assets/login_kakao.png';

const kakaoOAuthHandler = () => {
  const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  window.location.href = KAKAO_AUTH_URL;
};

const naverOAuthHandler = () => {
  const CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
  const CLIENT_SECRET = process.env.REACT_APP_NAVER_CLIENT_SECRET;
  const REDIRECT_URI = process.env.REACT_APP_NAVER_REDIRECT_URI;

  const STATE = localStorage.getItem('oauth_state') || Math.random().toString(36).substring(2);
  localStorage.setItem('oauth_state', STATE);

  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}`;

  window.location.href = NAVER_AUTH_URL;
};

function LoginSignUp({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { name: kakaoName, email: kakaoEmail, action: initialAction } = location.state || { name: "", email: "", action: "Login" };

  const [action, setAction] = useState(initialAction);
  const [leftContentIndex, setLeftContentIndex] = useState(0);
  const [email, setEmail] = useState(kakaoEmail || "");
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(kakaoName || "");
  const [birthday, setBirthday] = useState("");
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(false);
  const [isKakaoLoggedIn, setIsKakaoLoggedIn] = useState(!!kakaoEmail);

  const [insertUserData] = useMutation(INSERT_USER_INFO);
  const [getUserData] = useLazyQuery(GET_ONE_USER);

  useEffect(() => {
    const fetchData = async () => {
      const googleUserInfo = await fetchGoogleUserData();
      if (googleUserInfo) {
        setName(googleUserInfo.name);
        setEmail(googleUserInfo.email);
        setIsGoogleLoggedIn(true);
        setAction("Sign Up");

        // 소셜 로그인 성공 후 이메일 확인 및 자동 이동
        const param = {
          "user": {
            "_and": [
              {"email": {"_eq": googleUserInfo.email}}
            ]
          } 
        };
        const userData = await getUserData({variables: param});
        const storedEmail = localStorage.getItem('userEmail');
        if (userData.data.User.length > 0 || (storedEmail && storedEmail === googleUserInfo.email)) {
          navigate("/", { state: { email: googleUserInfo.email, name: googleUserInfo.name } });
          alert(`로그인 성공!\n이메일: ${googleUserInfo.email}\n이름: ${googleUserInfo.name}`);
          localStorage.setItem("isLoggedIn", "true");
        }
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (action === "Sign Up" && isKakaoLoggedIn) {
      setEmail(kakaoEmail);
      setName(kakaoName);

      // 소셜 로그인 성공 후 이메일 확인 및 자동 이동
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail && storedEmail === kakaoEmail) {
        alert(`로그인 성공!\n이메일: ${kakaoEmail}\n이름: ${kakaoName}`);
        localStorage.setItem("isLoggedIn", "true");
        navigate("/", { state: { email: kakaoEmail, name: kakaoName } });
      }
    } else if (action === "Login") {
      setPassword("");
    }
  }, [action, isGoogleLoggedIn, isKakaoLoggedIn, kakaoEmail, kakaoName, navigate]);

  const leftContents = [
    {
      text: "SIBS",
      subText: "Suwon Internet Broadcasting System",
      imgSrc: [logo_img],
    },
    {
      text: "AI를 통한 실시간 채팅 필터링",
      subText: "비속어 및 설정된 금지어를 자동으로 필터링하세요!",
      imgSrc: [chatting_img],
    },
    {
      text: "방송도구를 활용한 실시간 소통",
      subText: "투표, 미니게임 등 다양한 확장 프로그램을 통해 시청자와 소통하세요!",
      imgSrc: [minigame1_img],
    },
  ];

  const { text, subText, imgSrc } = leftContents[leftContentIndex];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (action === "Sign Up") {
      const userData = { name, email, password: crypto.SHA512(password).toString(), birthday };
      try {
        await insertUserData({ variables: { user: userData } });
        localStorage.setItem("userData", JSON.stringify(userData));
        alert("회원가입이 완료되었습니다!");
        setIsGoogleLoggedIn(false);
        setIsKakaoLoggedIn(false);
        setAction("Login");
        setPassword("");
      } catch (error) {
        console.error("Error inserting user data:", error);
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } else { // 로그인 시
      const savedUserData = JSON.parse(localStorage.getItem("userData"));
      const param = {
        "user": {
          "_and": [
            {"email": {"_eq": loginEmail}},
            {"password": {"_eq": crypto.SHA512(password).toString()}}
          ]
        } 
      }
      const userData = await getUserData({variables: param});
      const userName = userData.data.User[0].name;
      console.log(userData.data);
      if (
        userData.data.User.length > 0 || (
        savedUserData &&
        savedUserData.email === loginEmail &&
        savedUserData.password === crypto.SHA512(password).toString())
      ) {
        alert(`로그인 성공!\n이메일: ${loginEmail}\n이름: ${userName}`);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", loginEmail);
        localStorage.setItem("userName", userName);

        // 로그인 성공 시 onLoginSuccess 호출
        if (onLoginSuccess) {
          onLoginSuccess();
        }

        navigate("/", { state: { email: loginEmail, name: userName } });
      } else {
        alert("잘못된 이메일 또는 비밀번호입니다 다시 로그인해주세요.");
      }
    }
  };

  return (
    <div className="container">
      <div className="left-container">
        <div className={`text`}>{text}</div>
        <div className={`text2`}>{subText}</div>
        <div className={`image-container`}>
          {imgSrc.map((src, index) => (
            <img key={index} src={src} alt="Content" className="logo-image" />
          ))}
        </div>
      </div>
      <div className="right-container">
        <div className="header">
          <div className="title">{action}</div>
          <div className="underline"></div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="inputs">
            {action === "Sign Up" && (
              <>
                {isGoogleLoggedIn || isKakaoLoggedIn || email ? (
                  <>
                    <div className="input">
                      <img src={user_icon} alt="User Icon" />
                      <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        readOnly
                      />
                    </div>
                    <div className="input">
                      <img src={email_icon} alt="Email Icon" />
                      <input
                        type="email"
                        placeholder="Email ID"
                        value={email}
                        readOnly
                      />
                    </div>
                    <div className="input">
                      <img src={password_icon} alt="Password Icon" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="input">
                      <img src={birthday_icon} alt="Birthday Icon" />
                      <input
                        type="date"
                        placeholder="Birthday"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                      />
                    </div>
                    <div className="input create-account">
                      <button type="submit" className="submit-button">
                        계정 만들기
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="social-login vertical">
                    <div
                      className="social-button signup-button"
                      onClick={kakaoOAuthHandler}
                      style={{
                        backgroundImage: `url(${signup_kakao})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    ></div>
                    <div
                      className="social-button signup-button"
                      onClick={googleOAuthHandler}
                      style={{
                        backgroundImage: `url(${signup_google})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    ></div>
                    <div
                      className="social-button signup-button naver-button" // 'naver-button' 클래스 추가
                      onClick={naverOAuthHandler}
                      style={{
                        backgroundImage: `url(${signup_naver})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    ></div>
                  </div>
                )}
              </>
            )}
            {action === "Login" && (
              <>
                <div className="input">
                  <img src={email_icon} alt="Email Icon" />
                  <input
                    type="text"
                    placeholder="Email ID"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="input">
                  <img src={password_icon} alt="Password Icon" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
                <div className="input login-button">
                  <button type="submit" className="submit-button">
                    로그인
                  </button>
                </div>
              </>
            )}
          </div>
        </form>

        {action === "Login" && (
          <div className="social-login horizontal">
            <div
              className="social-button rect-button"
              onClick={kakaoOAuthHandler}
              style={{
                backgroundImage: `url(${login_kakao})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div
              className="social-button login-button"
              onClick={googleOAuthHandler}
              style={{
                backgroundImage: `url(${login_google})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div
              className="social-button login-button"
              onClick={naverOAuthHandler}
              style={{
                backgroundImage: `url(${login_naver})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          </div>
        )}

        <div className="submit-container">
          <div
            className={action === "Login" ? "submit gray" : "submit"}
            onClick={() => {
              setAction("Sign Up");
            }}
          >
            Sign Up
          </div>
          <div
            className={action === "Sign Up" ? "submit gray" : "submit"}
            onClick={() => {
              setAction("Login");
            }}
          >
            Login
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSignUp;
