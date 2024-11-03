import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Home.module.css';
import logo from './Components/Assets/logo.png';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import { useModal } from './ModalContext';
import CloseIcon from '@mui/icons-material/Close';
import PersonsIcon from '@mui/icons-material/Group';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import sportsImg from './Components/Assets/sports-bg.png';
import jcImg from './Components/Assets/jc-bg.png';
import gameImg from './Components/Assets/game-bg.png';
import mukbangImg from './Components/Assets/mukbang-bg.png';
import chatImg from './Components/Assets/chatting.png';
import voteImg from './Components/Assets/vote.png';
import quizImg from './Components/Assets/quiz.png';
import rouletteImg from './Components/Assets/roulette.png';
import bannedwordImg from './Components/Assets/bannedword.png';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, name } = location.state || { email: "", name: "" };
  const { isModalOpen, openModal, closeModal } = useModal();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || "");
  const [activeTab, setActiveTab] = useState('Just Chatting'); // 기본적으로 Just Chatting 탭이 활성화됨
  const aifilterRef = useRef(null); // Ref for the aifilter section

  useEffect(() => {
    if (email && name) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', name);
      setIsLoggedIn(true);
      setUserName(name);
    } else {
      const storedEmail = localStorage.getItem('userEmail');
      const storedName = localStorage.getItem('userName');
      if (storedEmail && storedName) {
        setIsLoggedIn(true);
        setUserName(storedName);
      }
    }
  }, [email, name]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeDropdown);
    return () => {
      document.removeEventListener('mousedown', closeDropdown);
    };
  }, []);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      setIsLoggedIn(false);
      setUserName("");
      navigate('/');
    } else {
      openModal();
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setUserName(localStorage.getItem('userName'));
  };

  const navigateToHome = () => {
    navigate('/');
  };

  const handleGetStartedClick = () => {
    if (isLoggedIn) {
      navigate('/chatroom');
    } else {
      openModal();
    }
  };

  const handleScrollToAIFilter = () => {
    if (aifilterRef.current) {
      aifilterRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.root}>
      <header className="w-full bg-white fixed top-0 left-0 shadow z-50">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-1 flex items-center">
              <a className="block text-teal-600" href="#" onClick={navigateToHome}>
                <span className="sr-only">Home</span>
                <img src={logo} alt="Logo" className="h-8" />
              </a>
              <h2 className="text-2xl font-semibold ml-1">SIBS</h2>
            </div>

            <div className="md:flex md:items-center md:gap-12">
              <nav aria-label="Global" className="hidden md:block">
                <ul className="flex items-center gap-6 text-sm">
                  <li>
                    <a className="text-black transition hover:text-gray-500/75" href="#getStarted"> 시작하기 </a>
                  </li>
                  <li className="relative" ref={dropdownRef}>
                    <button
                      className="text-black transition hover:text-gray-500/75"
                      onClick={toggleDropdown}
                    >
                      기능
                    </button>
                    {isDropdownOpen && (
                      <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <li>
                          <a
                            href="#aifilter"
                            onClick={handleScrollToAIFilter}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            AI 채팅 필터링
                          </a>
                        </li>
                        <li>
                        <a
                            href="#vote"
                            onClick={handleScrollToAIFilter}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            투표 기능
                          </a>
                        </li>
                        <li>
                          <a
                            href="#roulette"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            돌림판 기능
                          </a>
                        </li>
                        <li>
                          <a
                            href="#quiz"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            퀴즈 기능
                          </a>
                        </li>
                      </ul>
                    )}
                  </li>

                  <li>
                    <button
                      className="text-black transition hover:text-gray-500/75"
                      onClick={() => navigate('/chatroom')}
                    >
                      SIBS 체험하기
                    </button>
                  </li>
                </ul>
              </nav>

              <div className="flex items-center gap-4">
                <div className="sm:flex sm:gap-4">
                  {isLoggedIn ? (
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-500">
                        환영합니다, {userName}님!
                      </span>
                      <button
                        className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow"
                        onClick={handleAuthAction}
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow transition hover:text-black hover:bg-white focus:outline-none focus:ring focus:ring-black-400"
                      onClick={handleAuthAction}
                    >
                      시작하기
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="getStarted" className="overflow-hidden bg-gray-50 sm:grid mt-50 sm:grid-cols-2 sm:items-center min-h-screen">
        <div className="p-8 md:p-12 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
            <h3 className="text-xl font-bold text-gray-900 md:text-3xl">
              나만의 <span className="align-middle whitespace-nowrap rounded-full border border-black px-2.5 py-0.5 text-sm text-black"><span className='text-red-500'>●</span> Live</span> 방송 도우미 SIBS
            </h3>

            <p className="hidden text-gray-500 text-lg md:mt-4 md:block">
              SIBS를 활용해 나만의 라이브 방송을 만들어가세요
            </p>
            <div className="mt-4 md:mt-8">
              <button
                onClick={handleGetStartedClick}
                className="inline-block rounded bg-black px-12 py-3 text-base md:text-lg font-medium text-white transition hover:bg-white hover:text-black focus:outline-none focus:ring focus:ring-black-400"
              >
                지금 시작하기!
              </button>
            </div>
          </div>
        </div>

        <div
          className={`h-full w-full flex flex-col justify-start items-center pt-8 ${
            ['Just Chatting', 'Game', 'Sports', 'Mukbang'].includes(activeTab)
              ? 'max-h-screen bg-cover bg-center sm:h-[calc(100%_-_2rem)] sm:self-end sm:rounded-ss-[30px] md:h-[calc(100%_-_4rem)] md:rounded-ss-[60px]'
              : ''
          }`}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mt-20 fiexd">SIBS를 이용중인 스트리머</h2>
          <div className="w-full mt-10">
            <div className="sm:hidden">
              <label htmlFor="Tab" className="sr-only">Tab</label>
              <select id="Tab" className="w-full rounded-md border-gray-200" onChange={(e) => setActiveTab(e.target.value)} value={activeTab}>
                <option value="Just Chatting">Just Chatting</option>
                <option value="Game">Game</option>
                <option value="Mukbang">Mukbang</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex justify-center gap-6">
                  <a
                    href="#"
                    onClick={() => setActiveTab('Just Chatting')}
                    className={`shrink-0 ${activeTab === 'Just Chatting' ? 'rounded-t-lg border border-gray-300 border-b-white p-3 text-sm font-medium text-sky-600' : 'border border-transparent p-3 text-sm font-medium text-gray-500 hover:text-gray-700'}`}
                  >
                    Just Chatting
                  </a>

                  <a
                    href="#"
                    onClick={() => setActiveTab('Game')}
                    className={`shrink-0 ${activeTab === 'Game' ? 'rounded-t-lg border border-gray-300 border-b-white p-3 text-sm font-medium text-sky-600' : 'border border-transparent p-3 text-sm font-medium text-gray-500 hover:text-gray-700'}`}
                  >
                    Game
                  </a>

                  <a
                    href="#"
                    onClick={() => setActiveTab('Mukbang')}
                    className={`shrink-0 ${activeTab === 'Mukbang' ? 'rounded-t-lg border border-gray-300 border-b-white p-3 text-sm font-medium text-sky-600' : 'border border-transparent p-3 text-sm font-medium text-gray-500 hover:text-gray-700'}`}
                  >
                    Mukbang
                  </a>

                  <a
                    href="#"  
                    onClick={() => setActiveTab('Sports')}
                    className={`shrink-0 ${activeTab === 'Sports' ? 'rounded-t-lg border border-gray-300 border-b-white p-3 text-sm font-medium text-sky-600' : 'border border-transparent p-3 text-sm font-medium text-gray-500 hover:text-gray-700'}`}
                  >
                    Sports
                  </a>
                </nav>
              </div>
            </div>
          </div>

          {/* Tabs Content */}
          {activeTab === 'Just Chatting' && (
            <div className="jc-tab grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <StreamCard imgSrc={jcImg} title="토크 방송" streamer="감스트" viewers="2,500" />
              <StreamCard imgSrc={jcImg} title="토크 방송" streamer="감스트" viewers="2,500" />
              <StreamCard imgSrc={jcImg} title="토크 방송" streamer="감스트" viewers="2,500" />
              <StreamCard imgSrc={jcImg} title="토크 방송" streamer="감스트" viewers="2,500" />
            </div>
          )}

          {activeTab === 'Game' && (
            <div className="game-tab grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <StreamCard imgSrc={gameImg} title="게임 방송" streamer="감스트" viewers="2,500" />
              <StreamCard imgSrc={gameImg} title="게임 방송" streamer="감스트" viewers="2,500" />
              <StreamCard imgSrc={gameImg} title="게임 방송" streamer="감스트" viewers="2,500" />
              <StreamCard imgSrc={gameImg} title="게임 방송" streamer="감스트" viewers="2,500" />
            </div>
          )}

          {activeTab === 'Mukbang' && (
            <div className="mukbang-tab grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <StreamCard imgSrc={mukbangImg} title="먹방" streamer="감스트" viewers="2,500" />
              <StreamCard imgSrc={mukbangImg} title="먹방" streamer="감스트" viewers="2,500" />
              <StreamCard imgSrc={mukbangImg} title="먹방" streamer="감스트" viewers="2,500" />
              <StreamCard imgSrc={mukbangImg} title="먹방" streamer="감스트" viewers="2,500" />
            </div>
          )}

          {activeTab === 'Sports' && (
            <div className="sports-tab grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <StreamCard imgSrc={sportsImg} title="스포츠 중계 방송" streamer="감스트" viewers="2,500" />
              <StreamCard imgSrc={sportsImg} title="스포츠 중계 방송" streamer="감스트" viewers="2,500" />
              <StreamCard imgSrc={sportsImg} title="스포츠 중계 방송" streamer="감스트" viewers="2,500" />
              <StreamCard imgSrc={sportsImg} title="스포츠 중계 방송" streamer="감스트" viewers="2,500" />
            </div>
          )}
        </div>
      </section>

      {/* Use the new FuncSection component to wrap the sections */}
      <FuncSection
        id="aifilter"
        title="AI를 활용한 실시간 채팅 필터링"
        description="학습된 AI 모델을 활용하여 실시간으로 입력되는 채팅을 차단합니다. 뿐만 아니라
        AI가 감지하지 못하는 비속어를 금지어로 설정해 금지어를 입력했을 경우에도
        실시간으로 필터링 됩니다. 이를 통해 원활한 라이브 방송 환경을 조성합니다."
        imgSrc={chatImg}
        buttonText="지금 시작하기!"
        buttonAction={handleGetStartedClick}
        reverse={false}
      />

      <FuncSection
        id="vote"
        title="실시간 소통을 위한 방송 기능-1 투표 기능"
        description="스트리머가 직접 투표를 열어 시청자들과 소통할 수 있는 기능입니다. 투표 주제와 보기를 입력 후 투표를 시작하세요!"
        imgSrc={voteImg}
        buttonText="지금 시작하기!"
        buttonAction={handleGetStartedClick}
        reverse={true}
      />

      <FuncSection
        id="roulette"
        title="실시간 소통을 위한 방송 기능-2 룰렛 기능"
        description="스트리머가 시청자에게 받은 의견을 룰렛에 넣어 뽑을 수 있는 기능입니다. 시청자와의 소통을 통해 항목을 추가해서 룰렛을 시작하세요!"
        imgSrc={rouletteImg}
        buttonText="지금 시작하기!"
        buttonAction={handleGetStartedClick}
        reverse={false}
      />

      <FuncSection
        id="quiz"
        title="실시간 소통을 위한 방송 기능-3 퀴즈 기능"
        description="기본적으로 제공하는 퀴즈와 시청자가 직접 만든 퀴즈를 스트리머가 직접 풀어볼 수 있는 기능입니다. 스트리머에게 창의적인 문제를 내보세요!"
        imgSrc={quizImg}
        buttonText="지금 시작하기!"
        buttonAction={handleGetStartedClick}
        reverse={true}
      />

      {isModalOpen && (
        <>
          <div className={styles.overlay}></div> {/* 배경을 어둡게 하기 위한 오버레이 */}
          <div className={`${styles.loginSignupContainer} ${styles.showContainer}`}>
            <LoginSignup onLoginSuccess={handleLoginSuccess} />
            <button onClick={closeModal} className={styles.closeButton}>
              <CloseIcon />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function StreamCard({ imgSrc, title, streamer, viewers }) {
  return (
    <a href="#" className="block rounded-lg p-4 shadow-sm shadow-indigo-100 mt-4"> {/* mt-4 추가 */}
      <img
        alt=""
        src={imgSrc}
        className="h-56 w-full rounded-md object-cover"
      />

      <div className="mt-2">
        <dl>
          <div>
            <dt className="sr-only">방 제목</dt>
            <dd className="font-medium">{title}</dd>
          </div>

          <div>
            <dt className="sr-only">스트리머 명</dt>
            <dd className="text-sm text-gray-500">{streamer}</dd>
          </div>
        </dl>

        <div className="mt-6 flex items-center gap-8 text-xs">
          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <PersonsIcon className="text-indigo-700" /> {/* PersonIcon */}
            <div className="mt-1.5 sm:mt-0">
              <p className="text-gray-500">시청자</p>
              <p className="font-medium">{viewers}</p>
            </div>
          </div>

          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <RadioButtonCheckedIcon className="text-indigo-700" /> {/* RadioButtonCheckedIcon */}
            <div className="mt-1.5 sm:mt-0">
              <p className="text-gray-500">방송</p>
              <p className="font-medium">LIVE</p>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

// New FuncSection component
function FuncSection({ id, title, description, imgSrc, buttonText, buttonAction, reverse }) {
  return (
    <section id={id} className="relative overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2 sm:items-center z-20">
      <div className={`sm:w-full ${reverse ? 'order-2' : ''}`}>
        <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">{title}</h2>
          <p className="hidden text-gray-500 md:mt-4 md:block">{description}</p>
          <div className="mt-4 md:mt-8">
            <button
              onClick={buttonAction}
              className="inline-block rounded bg-black px-12 py-3 text-base md:text-lg font-medium text-white transition hover:bg-white hover:text-black focus:outline-none focus:ring focus:ring-black-400"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>

      <div className={`flex justify-center sm:w-full ${reverse ? 'order-1' : ''}`}>
        <img
          alt={id}
          src={imgSrc}
          className="transform scale-80 w-auto h-auto object-cover sm:self-end sm:rounded-ss-[30px] md:rounded-ss-[60px]" // scale-80 적용
        />
      </div>
    </section>
  );
}


export default Home;
