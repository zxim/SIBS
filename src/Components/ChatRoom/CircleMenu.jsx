import React, { useState, useRef, useEffect } from 'react';
import './CircleMenu.css';

import MenuIcon from '@mui/icons-material/Menu';
import FeedbackIcon from '@mui/icons-material/Feedback';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import QuizIcon from '@mui/icons-material/Quiz';
import OverlayPoll from '../Poll/OverlayPoll';
import WheelSpinner from '../WheelSpinner/WheelSpinner';
import BannedWord from '../BannedWord/BannedWord';
import Quiz from '../Quiz/Quiz';

const CircleMenu = ({ onOpenOverlayPoll, onOpenWheelSpinner, onOpenQuiz }) => { // Added onOpenQuiz prop
  const [open, setOpen] = useState(false);
  const [isBannedWordOpen, setBannedWordOpen] = useState(false); // BannedWord modal state

  const menuRef = useRef(null);

  const toggleMenu = () => {
    setOpen(!open);
  };

  const openBannedWord = () => {
    setBannedWordOpen(true);
  };

  const closeBannedWord = () => {
    setBannedWordOpen(false);
  };

  useEffect(() => {
    const links = menuRef.current.querySelectorAll('li');
    links.forEach((link, index) => {
      if (open) {
        link.style.transitionDelay = `${(links.length - index) * 0.1}s`;
        link.style.transform = `translateY(-${(index + 1) * 60}px) scale(1)`;
      } else {
        link.style.transitionDelay = `${(index + 1) * 0.1}s`;
        link.style.transform = `translateY(0px) scale(0)`;
      }
    });
  }, [open]);

  return (
    <div>
      <nav className="circle-menu" id="menu4" ref={menuRef}>
        <button onClick={toggleMenu}>
          <MenuIcon />
        </button>
        <ul>
          <li>
            <a href="#" onClick={openBannedWord}>
              <FeedbackIcon />
            </a>
          </li>
          <li>
            <a href="#" onClick={onOpenOverlayPoll}>
              <HowToVoteIcon />
            </a>
          </li>
          <li>
            <a href="#" onClick={onOpenWheelSpinner}>
              <DonutLargeIcon />
            </a>
          </li>
          <li>
            <a href="#" onClick={onOpenQuiz}>
              <QuizIcon />
            </a>
          </li>
        </ul>
      </nav>

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
    </div>
  );
};

export default CircleMenu;
