    import React, { useState } from 'react';

    const BannedWord = () => {
    const [bannedWords, setBannedWords] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const handleAddWord = () => {
        if (inputValue.trim() && !bannedWords.includes(inputValue.trim())) {
        setBannedWords([...bannedWords, inputValue.trim()]);
        setInputValue("");
        }
    };

    const handleDeleteWord = (wordToDelete) => {
        setBannedWords(bannedWords.filter(word => word !== wordToDelete));
    };

    return (
        <div style={styles.container}>
        {/* 왼쪽 요소: 금지 단어 리스트 */}
        <div style={styles.leftContainer}>
            <h3>금지 단어 목록</h3>
            <div style={styles.bannedWordContainer}>
            {bannedWords.map((word, index) => (
                <div key={index} style={styles.bannedWord}>
                <span>{word}</span>
                <button
                    onClick={() => handleDeleteWord(word)}
                    style={styles.deleteButton}
                >
                    삭제
                </button>
                </div>
            ))}
            </div>
        </div>

        {/* 오른쪽 요소: 입력창과 버튼 */}
        <div style={styles.rightContainer}>
            <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="금지할 단어를 입력하세요"
            style={styles.input}
            />
            <button onClick={handleAddWord} style={styles.button}>
            추가
            </button>
        </div>
        </div>
    );
    };

    const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        width: '1000px',
        height: '300px',
        top: '50',
        margin: '0 auto',
        border: '1px solid #ddd',
        borderRadius: '10px',
    },
    leftContainer: {
        width: '50%',
        height: '100%',
        padding: '10px',
        borderRight: '1px solid #ddd',
        overflowY: 'auto',
    },
    rightContainer: {
        width: '50%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '10px',
    },
    input: {
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '300px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    bannedWordContainer: {
        marginTop: '10px',
        padding: '10px',
        maxHeight: '100%',
        overflowY: 'auto',
    },
    bannedWord: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '5px',
        borderBottom: '1px solid #ddd',
    },
    deleteButton: {
        marginLeft: '10px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
    },
    };

    export default BannedWord;
