import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('A');
  const [moveHistory, setMoveHistory] = useState([]);
  const [capturedPieces, setCapturedPieces] = useState([]);
  const [winner, setWinner] = useState(null);

  const [gridItems, setGridItems] = useState([
    'A-P1', 'A-P2', 'A-H1', 'A-H2', 'A-P3',
    '', '', '', '', '',
    '', '', '', '', '',
    '', '', '', '', '',
    'B-P1', 'B-P2', 'B-H1', 'B-H2', 'B-P3'
  ]);

  const getItemIndex = (item) => gridItems.indexOf(item);

  const handleSelectItem = (item) => {
    if (!winner) {
      setSelectedItem(item);
    }
  };

  const handleMove = (direction) => {
    if (selectedItem) {
      const itemIndex = getItemIndex(selectedItem);
      if (itemIndex === -1) return;

      let newIndex = itemIndex;
      const moveAmount = (selectedItem === 'A-H1' || selectedItem === 'B-H1') ? 10 : 5; // 10 for A-H1 and B-H1 (2 steps), 5 for others (1 step)

      switch (direction) {
        case 'F':
          newIndex += moveAmount; // Move forward by two steps
          break;
        case 'B':
          newIndex -= moveAmount; // Move backward by two steps
          break;
        case 'L':
          newIndex -= 2; // Move left by two steps
          break;
        case 'R':
          newIndex += 2; // Move right by two steps
          break;
        case 'FL':
          newIndex += 8; // Move forward-left by two steps
          break;
        case 'FR':
          newIndex += 12; // Move forward-right by two steps
          break;
        case 'BL':
          newIndex -= 12; // Move backward-left by two steps
          break;
        case 'BR':
          newIndex -= 8; // Move backward-right by two steps
          break;
        default:
          return;
      }

      // Check if the new index is within bounds
      if (newIndex >= 0 && newIndex < gridItems.length) {
        const newGridItems = [...gridItems];
        const capturedPiece = newGridItems[newIndex] === '' ? null : newGridItems[newIndex];
        if (capturedPiece) {
          setCapturedPieces([...capturedPieces, capturedPiece]);
        }
        newGridItems[itemIndex] = '';
        newGridItems[newIndex] = selectedItem;

        // Update move history
        const newMoveHistory = [...moveHistory];
        if (capturedPiece) {
          newMoveHistory.push(`${selectedItem}: ${direction} (Captured ${capturedPiece})`);
        } else {
          newMoveHistory.push(`${selectedItem}: ${direction}`);
        }

        // Update the state
        setGridItems(newGridItems);
        setMoveHistory(newMoveHistory);
        setSelectedItem(null);

        // Check for a winner
        if (capturedPieces.includes('B-H2')) {
          setWinner('A');
        } else if (capturedPieces.includes('A-H2')) {
          setWinner('B');
        } else {
          setCurrentPlayer(currentPlayer === 'A' ? 'B' : 'A');
        }
      }
    }
  };

  const renderButtons = () => {
    if (selectedItem) {
      if (selectedItem.includes('-P')) {
        return (
          <div className="button-group">
            <button className="action-button" onClick={() => handleMove('L')}>L</button>
            <button className="action-button" onClick={() => handleMove('R')}>R</button>
            <button className="action-button" onClick={() => handleMove('F')}>F</button>
            <button className="action-button" onClick={() => handleMove('B')}>B</button>
          </div>
        );
      } else if (selectedItem.includes('-H1') || selectedItem.includes('-H2')) {
        return (
          <div className="button-group">
            <button className="action-button" onClick={() => handleMove('L')}>L</button>
            <button className="action-button" onClick={() => handleMove('R')}>R</button>
            <button className="action-button" onClick={() => handleMove('F')}>F</button>
            <button className="action-button" onClick={() => handleMove('B')}>B</button>
            {selectedItem.includes('-H2') && (
              <>
                <button className="action-button" onClick={() => handleMove('FL')}>FL</button>
                <button className="action-button" onClick={() => handleMove('FR')}>FR</button>
                <button className="action-button" onClick={() => handleMove('BL')}>BL</button>
                <button className="action-button" onClick={() => handleMove('BR')}>BR</button>
              </>
            )}
          </div>
        );
      }
    }
    return null;
  };

  const renderMoveHistory = () => {
    return (
      <div className="move-history">
        <h3>Move History</h3>
        <ul>
          {moveHistory.map((move, index) => (
            <li key={index} className={move.includes('Captured') ? 'captured' : ''}>{move}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderWinnerMessage = () => {
    if (winner) {
      return (
        <div className="winner-message">
          <p>🎉 Player {winner} wins!</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="app">
      <h2 className="header">Advanced Chess-like Game</h2>
      {renderWinnerMessage()}
      <div className="grid">
        {gridItems.map((item, index) => (
          <div
            key={index}
            className={`grid-item ${selectedItem === item ? 'selected' : ''}`}
            onClick={() => handleSelectItem(item)}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="selected-info">
        <p>Selected: {selectedItem}</p>
        {renderButtons()}
      </div>
      {renderMoveHistory()}
    </div>
  );
}

export default App;
