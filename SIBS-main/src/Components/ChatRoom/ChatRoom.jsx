import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useMutation, useSubscription } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import CircleMenu from './CircleMenu';
import OverlayPoll from '../Poll/OverlayPoll';
import WheelSpinner from '../WheelSpinner/WheelSpinner';
import BannedWord from '../BannedWord/BannedWord';
import QuizPlay from '../Quiz/QuizPlay'; // QuizPlay import
import logo from '../Assets/logo.png';
import './ChatRoom.css';
import { GET_CHAT_STREAM, GET_CHAT_STREAM_FILTERED, INSERT_CHAT } from '../../Query/query';

const userImages = [
  'https://i.pravatar.cc/150?img=2'
];

const chat = {
  "Entrance": "2024-07-28T04:00",
  "Room": 5
};

const userNames = ['User3'];

function ChatRoom() {
  const chatContainerRef = useRef();
  const dummy = useRef();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState('');
  const [userId] = useState(uuidv4());
  const [userImage] = useState(userImages[Math.floor(Math.random() * userImages.length)]);
  const [userName] = useState(userNames[Math.floor(Math.random() * userNames.length)]);
  const [dislikedUsers, setDislikedUsers] = useState(new Set());
  const [likedUsers, setLikedUsers] = useState(new Set());
  const [isOverlayPollOpen, setOverlayPollOpen] = useState(false);
  const [isWheelSpinnerOpen, setWheelSpinnerOpen] = useState(false);
  const [isBannedWordOpen, setBannedWordOpen] = useState(false);
  const [isQuizOpen, setQuizOpen] = useState(false); // QuizPlay modal state

  const [insertChat] = useMutation(INSERT_CHAT);
  const { data: chatData } = useSubscription(GET_CHAT_STREAM, { variables: chat });
  const { data: filteredData } = useSubscription(GET_CHAT_STREAM_FILTERED, { variables: chat });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    console.log("Messages:", messages);
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!formValue.trim()) return; // 빈 메시지 전송 방지

    try {
      console.log("Sending message for profanity check:", formValue);

      await insertChat({ variables: { chat: { content: formValue, sender_id: 44, chat_room_id: 5 } } });

      setFormValue('');
    } catch (err) {
      console.error('Error in sending message:', err.message);
    }
  };

  useEffect(() => {
    if (chatData && chatData.Chat_log_stream) {
      setMessages((prevMessages) => [
        ...prevMessages,
        ...chatData.Chat_log_stream.map(chatLogStreamElement => ({
          text: chatLogStreamElement.content,
          createdAt: chatLogStreamElement.sent_at,
          userName,
          likes: 0,
          dislikes: 0,
          messageId: chatLogStreamElement.message_id,
          senderId: chatLogStreamElement.sender_id,
          isFiltered: chatLogStreamElement.is_filtered
        }))
      ]);
    }
  }, [chatData]);

  useEffect(() => {
    if (filteredData && filteredData.Chat_log_stream) {
      setMessages((prevMessages) =>
        prevMessages.map(message =>
          message.messageId === filteredData.Chat_log_stream.message_id
            ? { ...message, text: `${userName}의 채팅이 차단되었습니다`, isWarning: true }
            : message
        )
      );
    }
  }, [filteredData]);

  const openOverlayPoll = () => setOverlayPollOpen(true);
  const closeOverlayPoll = () => setOverlayPollOpen(false);
  
  const openWheelSpinner = () => setWheelSpinnerOpen(true);
  const closeWheelSpinner = () => setWheelSpinnerOpen(false);

  const openBannedWord = () => setBannedWordOpen(true);
  const closeBannedWord = () => setBannedWordOpen(false);

  const openQuiz = () => setQuizOpen(true);  // QuizPlay modal 열기
  const closeQuiz = () => setQuizOpen(false); // QuizPlay modal 닫기

  return (
    <div>
      <header className="w-full bg-white fixed top-0 left-0 shadow z-50">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-1 flex items-center">
              <a className="block text-teal-600" href="#" onClick={() => navigate('/')}>
                <span className="sr-only">Home</span>
                <img src={logo} alt="Logo" className="h-8" />
              </a>
              <h2 className="text-2xl font-semibold ml-1">SIBS</h2>
            </div>
            <div className="md:flex md:items-center md:gap-12">
              <nav aria-label="Global" className="hidden md:block">
                <ul className="flex items-center gap-6 text-sm">
                  <li>
                    <a 
                      className="text-black transition hover:text-gray-500/75" 
                      href="http://localhost:3000"
                    >
                      돌아가기
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>
    
      <div className="chat-room" style={{ height: 'calc(100vh - 4rem)', marginTop: '4rem' }}>
        <header className='chat-header'>
          <h1>채팅방</h1>
        </header>
        <div className="chat-container" ref={chatContainerRef} style={{ height: 'calc(100% - 6rem)' }}>
          <CircleMenu 
            onOpenOverlayPoll={openOverlayPoll} 
            onOpenWheelSpinner={openWheelSpinner} 
            onOpenQuiz={openQuiz}  // QuizPlay 모달 열기 함수 전달
            onOpenBannedWord={openBannedWord}
          />

          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg}
              dislikedUsers={dislikedUsers}
              likedUsers={likedUsers}
            />
          ))}
          <span ref={dummy}></span>
        </div>
        <form className='chatroom-container' onSubmit={sendMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="채팅을 입력해주세요"
          />
          <button type="submit">보내기</button>
        </form>
      </div>

      {/* OverlayPoll Modal */}
      {isOverlayPollOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={closeOverlayPoll}>
              &times;
            </button>
            <OverlayPoll onClose={closeOverlayPoll} />
          </div>
        </div>
      )}

      {/* WheelSpinner Modal */}
      {isWheelSpinnerOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={closeWheelSpinner}>
              &times;
            </button>
            <WheelSpinner onClose={closeWheelSpinner} />
          </div>
        </div>
      )}

      {/* BannedWord Modal */}
      {isBannedWordOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={closeBannedWord}>
              &times;
            </button>
            <BannedWord />
          </div>
        </div>
      )}

      {isQuizOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={closeQuiz}>
              &times;
            </button>
            <QuizPlay onClose={closeQuiz} />
          </div>
        </div>
      )}
    </div>
  );
}

function ChatMessage({ message, onLike, onDislike, dislikedUsers, likedUsers }) {
  const { text, userName, likes, dislikes, uid, isWarning } = message;

  return (
    <div className={`message ${userName === "SIBS✅" ? "system-message" : ""}`}>
      <div className="message-content">
        <div className="message-header">
          <div
            className="username"
            style={{
              color: likes >= 30 ? '#99f77c' : dislikedUsers.has(uid) ? 'red' : 'black',
            }}
          >
            {userName}
          </div>
        </div>
        <p style={{ color: isWarning ? 'red' : 'black' }}>{text}</p>
        {userName !== "SIBS✅" && (
          <div className="message-actions">
            <button onClick={onLike}>👍 {likes}</button>
            <button onClick={onDislike}>👎 {dislikes}</button>
            <button>번역</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatRoom;
