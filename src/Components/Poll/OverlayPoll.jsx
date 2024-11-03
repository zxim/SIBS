import React, { useState } from 'react';

const OverlayPoll = ({ onClose }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]); 
  const [votes, setVotes] = useState([0]); 
  const [voted, setVoted] = useState(false);
  const [pollActive, setPollActive] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAddOption = () => {
    setOptions([...options, ""]);
    setVotes([...votes, 0]); 
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleDeleteOption = (index) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      const newVotes = votes.filter((_, i) => i !== index);
      setOptions(newOptions);
      setVotes(newVotes);
      if (voted && newOptions.length === 1) {
        setVoted(false);
      }
    }
  };

  const handleVote = (index) => {
    if (!voted) {
      const newVotes = [...votes];
      newVotes[index] += 1;
      setVotes(newVotes);
      setVoted(true);
    }
  };

  const handleStartPoll = () => {
    setPollActive(true);
    setShowResults(false);
  };

  const handleEndPoll = () => {
    setPollActive(false);
    setShowResults(true);
  };

  const totalVotes = votes.reduce((acc, vote) => acc + vote, 0);

  return (
    <div style={styles.overlayContainer}>
      <div style={styles.pollBox}>
        <button onClick={onClose} style={styles.closeButton}>
          &times;
        </button>
        {!pollActive ? (
          <div>
            <h3 style={styles.title}>새 투표 시작</h3>
            <input
              type="text"
              placeholder="투표 주제 입력"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={styles.input}
            />
            <div style={styles.optionSection}>
              <h4>옵션 입력</h4>
              {options.map((option, index) => (
                <div key={index} style={styles.optionInputContainer}>
                  <span style={styles.optionNumber}>{index + 1}.</span>
                  <input
                    type="text"
                    placeholder="옵션 입력"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    style={styles.input}
                  />
                  <button
                    onClick={() => handleDeleteOption(index)}
                    style={styles.deleteButton}
                  >
                    삭제
                  </button>
                </div>
              ))}
              <button onClick={handleAddOption} style={styles.button}>
                옵션 추가
              </button>
            </div>
            <button
              onClick={handleStartPoll}
              style={styles.button}
              disabled={!question || options.some(option => option.trim() === "") || options.length < 2}
            >
              투표 시작
            </button>
          </div>
        ) : (
          <div>
            <h3>{question}</h3>
            <div style={styles.optionsContainer}>
              {options.map((option, index) => (
                <div key={index} style={styles.optionContainer}>
                  <button
                    onClick={() => handleVote(index)}
                    disabled={voted}
                    style={styles.voteButton}
                  >
                    {option}
                  </button>
                  {voted && (
                    <div style={styles.voteCount}>
                      {totalVotes > 0
                        ? `${((votes[index] / totalVotes) * 100).toFixed(1)}%`
                        : "0%"}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={handleEndPoll}
              style={styles.button}
              disabled={!pollActive}
            >
              투표 종료
            </button>
          </div>
        )}

        {showResults && (
          <div style={styles.resultsContainer}>
            <h3>투표 결과</h3>
            <div style={styles.optionsContainer}>
              {options.map((option, index) => (
                <div key={index} style={styles.optionContainer}>
                  <div style={styles.optionText}>
                    {option}: {votes[index]} 표 ({totalVotes > 0 ? `${((votes[index] / totalVotes) * 100).toFixed(1)}%` : "0%"})
                  </div>
                  <div style={styles.barContainer}>
                    <div
                      style={{
                        ...styles.bar,
                        width: `${totalVotes > 0 ? (votes[index] / totalVotes) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={onClose} style={styles.button}>
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlayContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  pollBox: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "20px",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    position: 'relative',
  },
  title: {
    marginBottom: "10px",
  },
  optionSection: {
    marginTop: "20px",
    marginBottom: "20px",
  },
  optionInputContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  optionNumber: {
    marginRight: "10px",
    fontWeight: "bold",
  },
  optionsContainer: {
    marginBottom: "20px",
  },
  optionContainer: {
    marginBottom: "10px",
  },
  voteButton: {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    width: "100%",
  },
  voteCount: {
    marginTop: "5px",
    color: "#555",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    margin: "10px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
  },
  deleteButton: {
    marginLeft: "10px",
    padding: "5px",
    fontSize: "12px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    margin: "5px",
    width: "60%",
  },
  resultsContainer: {
    marginTop: "20px",
  },
  optionText: {
    marginBottom: "5px",
  },
  barContainer: {
    width: "100%",
    backgroundColor: "#eee",
    borderRadius: "4px",
    overflow: "hidden",
    height: "10px",
  },
  bar: {
    height: "100%",
    backgroundColor: "#007bff",
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  },
};

export default OverlayPoll;
