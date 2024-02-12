import React, { useState, useRef } from 'react';
import './App.css';
import backgroundMusic from './backgroundMusic.mp3';

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
  "https://i.pinimg.com/564x/62/92/bc/6292bc7fc135d814017a6cab4336c1d8.jpg",
  "https://i.pinimg.com/564x/f3/b1/cf/f3b1cfd77a09ffd2c565471bef99da1b.jpg",
  "https://media1.tenor.com/m/u8M7kk5ZXmwAAAAd/banana-cat-crying.gif"
];

const yesPictures = [
  "https://i.pinimg.com/564x/db/6d/5c/db6d5ce75208eabbc87b564eafcbdaa8.jpg",
  "https:media1.tenor.com/m/ns27oDL6PPIAAAAC/cats-cat-with-flower.gif"
];

function App() {
  const [audio] = useState(new Audio(backgroundMusic));
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [currentPictureIndex, setCurrentPictureIndex] = useState(0);
  const [currentPicture, setCurrentPicture] = useState(noPictures[currentPictureIndex]);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState(phrases[currentPhraseIndex]);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const yesRef = useRef(null);
  const noRef = useRef(null);

  const buttonSize = noCount * 20 + 16;

  function handleNoClick() {
    setNoCount(noCount + 1);
    setCurrentPictureIndex((currentPictureIndex + 1) % noPictures.length);
    setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length);
  }

  async function handleYesClick() {
    setYesPressed(true);
    audio.play();
    const response = await fetch('/api/send-sms', {
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
    // Change picture every 5 seconds
    setInterval(() => {
      setCurrentPictureIndex((currentPictureIndex + 1) % (yesPressed ? yesPictures.length : noPictures.length));
    }, 5000);
  }

  function getButtonText() {
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
        x: yesButtonRect.right + 1,
        y: yesButtonRect.top - 12,
      });
    }
  }, []);

  // Change phrase every 3 seconds for the "No" button
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentPhraseIndex]);

  // Change picture every 3 seconds for the "No" button
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPictureIndex((currentPictureIndex + 1) % noPictures.length);
      setCurrentPicture(noPictures[currentPictureIndex]);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentPictureIndex]);

  return (
    <div className='valentine-container'>
      {yesPressed ? (
        <>
          <img src={yesPictures[currentPictureIndex]} alt="picture" />
          <div className='text'>yes pls, Yeyyyyy!! Thank you </div>
        </>
      ) : (
        <>
          <img src={currentPicture} alt="picture" style={{ width: '400px', height: '300px' }} />

          <div className='text'>Hi! Nathalie, Will you be my Valentine?</div>
          <div>
            <button
              ref={yesRef}
              className='yesButton'
              style={{ fontSize: buttonSize, backgroundColor: 'green', color: 'white' }}
              onClick={handleYesClick}>
              Yes
            </button>
            <button
              ref={noRef}
              className='noButton'
              style={{ backgroundColor: 'red', color: 'white', position: 'absolute', left: noPosition.x, top: noPosition.y }}
              onClick={handleNoClick}
              onMouseEnter={(event) => handleNoHover(event)}>
              {phrases[currentPhraseIndex]}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
