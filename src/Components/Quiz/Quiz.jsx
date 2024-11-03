import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quiz.css'
const Quiz = () => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState('');
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newOptions];
    updatedOptions[index] = value;
    setNewOptions(updatedOptions);
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim() && newOptions.every(opt => opt.trim()) && correctOption.trim()) {
      setQuizQuestions([...quizQuestions, { question: newQuestion, options: newOptions, answer: correctOption }]);
      setNewQuestion('');
      setNewOptions(['', '', '', '']);
      setCorrectOption('');
    }
  };

  const handleDeleteQuestion = (index) => {
    setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
  };

  const handleStartQuiz = () => {
    navigate('/quizplay');
  };

  return (
    <div className="quiz-container">
      <h1>퀴즈 관리</h1>
      <div className="add-question-form">
        <h2>문제 추가하기</h2>
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="문제를 입력하세요"
        />
        <div className="options-input">
          {newOptions.map((option, index) => (
            <div key={index} className="option-input">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`옵션 ${index + 1}`}
              />
            </div>
          ))}
        </div>
        <input
          type="text"
          value={correctOption}
          onChange={(e) => setCorrectOption(e.target.value)}
          placeholder="정답을 입력하세요"
        />
        <button onClick={handleAddQuestion}>문제 추가</button>
      </div>

      <div className="question-list">
        <h2>문제 목록</h2>
        {quizQuestions.length === 0 ? (
          <p>문제가 없습니다.</p>
        ) : (
          <ul>
            {quizQuestions.map((q, index) => (
              <li key={index}>
                <span>{q.question}</span>
                <button onClick={() => handleDeleteQuestion(index)}>삭제</button>
              </li>
            ))}
          </ul>
        )}
        <button onClick={handleStartQuiz}>퀴즈 풀기</button>
      </div>
    </div>
  );
};

export default Quiz;