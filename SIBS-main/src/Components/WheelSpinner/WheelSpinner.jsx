import React, { useState } from 'react';

const WheelSpinner = ({ onClose }) => {
  const [items, setItems] = useState(['항목 1', '항목 2', '항목 3']);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleInputChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, `항목 ${items.length + 1}`]);
  };

  const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSpin = () => {
    if (!spinning && items.length > 0) {
      setSpinning(true);
      setSelectedItem(null);

      const randomRotation = Math.floor(Math.random() * 360) + 3600;
      const newRotation = rotation + randomRotation;
      setRotation(newRotation);

      setTimeout(() => {
        const normalizedRotation = newRotation % 360;
        const sliceAngle = 360 / items.length;
        const selectedIndex = Math.floor((normalizedRotation / sliceAngle) % items.length);
        setSelectedItem(items[selectedIndex]);
        setSpinning(false);
      }, 5000);
    }
  };

  const sliceAngle = 360 / items.length;
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF0'];

  return (
    <div style={styles.container}>
      <div style={styles.inputContainer}>
        {items.map((item, index) => (
          <div key={index} style={styles.inputRow}>
            <span style={styles.inputLabel}>{index + 1}.</span>
            <input
              type="text"
              value={item}
              onChange={(e) => handleInputChange(index, e.target.value)}
              style={styles.input}
            />
            <button onClick={() => handleDeleteItem(index)} style={styles.deleteButton}>삭제</button>
          </div>
        ))}
        <button onClick={handleAddItem} style={styles.addButton}>항목 추가</button>
      </div>

      <div style={styles.controls}>
        <button onClick={handleSpin} style={styles.button} disabled={spinning || items.length === 0}>돌리기</button>
      </div>

      <div style={styles.wheelContainer}>
        <div style={{ ...styles.wheel, ...wheelStyle(rotation, spinning) }}>
          {items.map((item, index) => (
            <div key={index} style={{
              ...styles.slice,
              transform: `rotate(${sliceAngle * index}deg)`,
              backgroundColor: colors[index % colors.length],
            }}>
              <span style={styles.label}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedItem && (
        <div style={styles.result}>
          <h3>당첨된 항목: {selectedItem}</h3>
        </div>
      )}
    </div>
  );
};

const wheelStyle = (rotation, spinning) => ({
  transform: `rotate(${rotation}deg)`,
  transition: spinning ? `transform 5s ease-out` : 'none',
});

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    marginTop: '50px',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  inputLabel: {
    marginRight: '10px',
    fontSize: '16px',
  },
  input: {
    width: '150px',
    padding: '5px',
    marginRight: '10px',
  },
  addButton: {
    padding: '10px',
    marginTop: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
  deleteButton: {
    padding: '5px',
    fontSize: '12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  controls: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
  wheelContainer: {
    position: 'relative',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '5px solid #333',
  },
  wheel: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    borderRadius: '50%',
  },
  slice: {
    width: '50%',
    height: '50%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transformOrigin: '0% 0%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#fff',
    textAlign: 'center',
  },
  label: {
    transform: `rotate(-90deg) translateY(-120%)`,
    display: 'block',
  },
  result: {
    marginTop: '20px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#007bff',
  },
};

export default WheelSpinner;
