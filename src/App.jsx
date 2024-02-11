import React, { useState, useRef } from 'react';
import './App.css';

const phrases = [
  "No",
  "Are you sure?",
  "Hmp!",
  "Dali naa :'<",
  "Pwease :'<",
  "Don't do this to me :(",
  "I'm gonna cry...",
  "You're breaking my <3 ;(",
  "Acm mo!",
  "Ano baaa?",
  "Ah, ayaw mo!",
  "pls idol :'<",
  "ok huhu:<"
];

const noPictures = [
  "https://media1.tenor.com/m/hnqwiqhkSy0AAAAC/hearts-flowers.gif",
  "https://media1.tenor.com/m/GY0DuyFAqLcAAAAC/woofwoof-judge.gif",
  "https://media.tenor.com/LlxPGK7ACcgAAAAi/sad-cat.gif",
  "https://media1.tenor.com/m/tNlPtcdBlpIAAAAC/puss-in-boots-cat.gif",
  "https://i.pinimg.com/originals/ea/66/fb/ea66fbb26d5752f51cef309b96351788.jpg",
  "https://i.pinimg.com/originals/c7/88/13/c788138cf85c69a5bcb553ab63eccd4f.jpg",
  "https://i.pinimg.com/originals/2e/f9/16/2ef9167c4490e16b078d6c0befbffef1.jpg",
  "https://i.pinimg.com/originals/d0/8d/db/d08ddbf19d47332e57d3c16bb2b6f389.png",
  //"https://media1.tenor.com/m/ns27oDL6PPIAAAAC/cats-cat-with-flower.gif",
  "https://i.pinimg.com/564x/62/92/bc/6292bc7fc135d814017a6cab4336c1d8.jpg",
  "https://i.pinimg.com/564x/f3/b1/cf/f3b1cfd77a09ffd2c565471bef99da1b.jpg",
  "https://media1.tenor.com/m/u8M7kk5ZXmwAAAAd/banana-cat-crying.gif"
];

function App() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [currentNoPicture, setCurrentNoPicture] = useState(noPictures[0]);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const yesRef = useRef(null);

  const yesButtonSize = noCount * 20 + 16;

  function handleNoClick() {
    setNoCount(noCount + 1);
    setCurrentNoPicture(noPictures[noCount % noPictures.length]);
  }

  async function handleYesClick() {
    setYesPressed(true);
    const response = await fetch('http://localhost:3001/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: '+639662636144', // Replace with the actual phone number
        message: 'Nathalie said yes! Yeyyyyy!',
      }),
    });

    if (!response.ok) {
      console.error('Failed to send SMS');
    } else {
      console.log('SMS sent successfully');
    }
  }

  function getNoButtonText() {
    return phrases[Math.min(noCount, phrases.length - 1)];
  }

  function handleNoHover() {
    // Generate random position for the "No" button within the window
    const newX = Math.random() * (window.innerWidth - 150); // 150 is the width of the button
    const newY = Math.random() * (window.innerHeight - 50); // 50 is the height of the button
    setNoPosition({ x: newX, y: newY });
  }

  // Ensure the initial position of the "No" button is aligned with the "Yes" button
  React.useEffect(() => {
    if (yesRef.current) {
      const yesButtonRect = yesRef.current.getBoundingClientRect();
      setNoPosition({
        x: yesButtonRect.right + 10,
        y: yesButtonRect.top - 4,
      });
    }
  }, []);

  return (
    <div className='valentine-container'>
      {yesPressed ? (
        <>
          <img src="https://i.pinimg.com/564x/e3/57/ff/e357ffb0bfd8de8e6b5d851725fe9fc8.jpg" alt="picture" />
          <div className='text'>Yeyyy!!:p </div>
        </>
      ) : (
        <>
          <img src={currentNoPicture} alt="picture" style={{ width: '400px', height: '300px' }} />

          <div className='text'>Hello, Nathalie! Will you be my Valentine?</div>
          <div>
            <button
              ref={yesRef}
              className='yesButton'
              style={{ fontSize: yesButtonSize, backgroundColor: 'green', color: 'white' }}
              onClick={handleYesClick}>
              Yes
            </button>
            <button
              className='noButton'
              style={{ backgroundColor: 'red', color: 'white', position: 'absolute', left: noPosition.x, top: noPosition.y }}
              onClick={handleNoClick}
              onMouseEnter={handleNoHover}>
              {getNoButtonText()}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
