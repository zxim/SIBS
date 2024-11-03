import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizPlay.css'; // CSS 스타일 import

const QuizPlay = () => {
  const [quizQuestions] = useState([
    // 문제 목록 예시. 실제로는 문제를 동적으로 가져와야 함
    { question: 'What is the capital of France?', options: ['Paris', 'London', 'Rome', 'Berlin'], answer: 'Paris' },
    { question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], answer: '4' }
  ]);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectOption = (option) => {
    setUserAnswer(option);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    setIsSubmitted(false);
    setUserAnswer('');
    setSelectedQuestion(selectedQuestion + 1);
  };

  return (
    <div className="quiz-play-container">
      <h1>퀴즈 풀기</h1>
      {quizQuestions.length === 0 ? (
        <p>등록된 퀴즈가 없습니다.</p>
      ) : (
        <div>
          <div className="quiz-question">
            <h2>{quizQuestions[selectedQuestion].question}</h2>
            <form onSubmit={handleSubmit}>
              <div className="options-list">
                {quizQuestions[selectedQuestion].options.map((option, index) => (
                  <div key={index} className="option">
                    <input
                      type="radio"
                      id={`option-${index}`}
                      name="quiz-option"
                      value={option}
                      checked={userAnswer === option}
                      onChange={() => handleSelectOption(option)}
                    />
                    <label htmlFor={`option-${index}`}>{option}</label>
                  </div>
                ))}
              </div>
              <button type="submit">제출</button>
            </form>
            {isSubmitted && (
              <div className="result">
                {userAnswer === quizQuestions[selectedQuestion].answer ? (
                  <p>정답입니다!</p>
                ) : (
                  <p>틀렸습니다. 정답은 {quizQuestions[selectedQuestion].answer}입니다.</p>
                )}
                {selectedQuestion < quizQuestions.length - 1 ? (
                  <button onClick={handleNextQuestion}>다음 문제</button>
                ) : (
                  <p>퀴즈가 끝났습니다.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPlay;