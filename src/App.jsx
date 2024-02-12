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
  "https://media1.tenor.com/m/ns27oDL6PPIAAAAC/cats-cat-with-flower.gif",
  "https://i.pinimg.com/564x/41/e2/db/41e2dbf1b9ebe97a4f0e9ef6f469863d.jpg",
  "https://i.pinimg.com/736x/37/48/ad/3748add39edab008a50bdf006f14cf37.jpg",
  "https://i.pinimg.com/236x/96/29/de/9629dea9e7ed89fb8ea86d9676893fe4.jpg",
  "https://i.pinimg.com/236x/9c/e4/1d/9ce41dd08aa8990cc1d2e6951f8d8093.jpg",
  "https://i.pinimg.com/236x/61/a9/18/61a91802b9d2aaf12e13e49cc6e9fb81.jpg",
  "https://i.pinimg.com/736x/f1/80/a0/f180a0864378b9fa7afedb678de58a8a.jpg",
  "https://i.pinimg.com/564x/af/ce/3f/afce3f46d532f8b858bcd5de5cd343ef.jpg",
  "https://i.pinimg.com/736x/1e/de/e9/1edee9bf196ec4582043339820eb88c9.jpg",
  "https://i.pinimg.com/736x/d4/7f/42/d47f4258997f2b976c788003a1e4873b.jpg",
  "https://i.pinimg.com/564x/a2/60/d7/a260d7537bf5b824ed858894148be0c1.jpg",
  "https://i.pinimg.com/564x/f8/68/d9/f868d9c4171cb4e472e2c1df531c809b.jpg",
  "https://i.pinimg.com/736x/bb/47/fc/bb47fcd95f5415085376e2f3c76c1207.jpg",
  "https://i.pinimg.com/736x/1f/2f/75/1f2f75bc7f84d4e9d50ce246d2cc28d1.jpg"
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
  const [currentYesPictureIndex, setCurrentYesPictureIndex] = useState(0);
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

    // Change picture to the next one in yesPictures in a loop
    const yesInterval = setInterval(() => {
      setCurrentYesPictureIndex((currentYesPictureIndex + 1) % yesPictures.length);
    }, 3000);

    // Reset the index after all pictures have been displayed
    setTimeout(() => {
      setCurrentYesPictureIndex(0);
      clearInterval(yesInterval); // Clear interval after all pictures have been displayed
    }, yesPictures.length * 3000);
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
        y: yesButtonRect.top + 4,
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
          <div className="yesPictureContainer">
            <img src={yesPictures[currentYesPictureIndex]} alt="" className="yesPicture" />
          </div>
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
