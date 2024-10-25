import React, { useState, useRef } from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  const [resultDisplay, setResultDisplay] = useState([]);
  const [activeTab, setActiveTab] = useState("Start Game");
  const [isRolling, setIsRolling] = useState(false);
  const audioRef = useRef(new Audio('/dice.mp3'));

  const diceImages = Array.from({ length: 8 }, (_, dieIndex) =>
    Array.from({ length: 6 }, (_, faceIndex) => `/images/Dice-${String(dieIndex * 6 + faceIndex + 1).padStart(2, '0')}.png`)
  );

  const getDiceForTab = () => {
    switch (activeTab) {
      case "Start Game":
        return [1, 2, 7, 8];
      case "Mid Game":
        return [3, 4, 7, 8];
      case "End Game":
        return [5, 6, 7, 8];
      default:
        return [];
    }
  };

  const assignUniqueAnimationClasses = () => {
    const animations = Array.from({ length: 10 }, (_, i) => `animate-cube${i + 1}`);
    return animations.sort(() => 0.5 - Math.random()).slice(0, getDiceForTab().length);
  };

  const getOutcome = (dieIndex, faceNumber) => {
    switch (dieIndex) {
      case 1:
        return faceNumber <= 4 ? "Mr. Monopoly" : "Travel Voucher";
      case 2:
        return faceNumber <= 4 ? "Mr. Monopoly" : "Stock Market";
      case 3:
      case 4:
        if (faceNumber <= 3) return "Stock Market";
        if (faceNumber === 4) return "Shenanigans";
        if (faceNumber === 5) return "Chance";
        return "Community Chest";
      case 5:
        return faceNumber <= 3 ? "Mr. Monopoly" : "Tax";
      case 6:
        return ["Shenanigans", "Chance", "Community Chest", "Shenanigans", "Chance", "Community Chest"][faceNumber - 1];
      default:
        return "";
    }
  };

  const rollDice = () => {
    setIsRolling(true);
    audioRef.current.play();

    const totalNumberDice = { current: 0 };
    const animations = assignUniqueAnimationClasses();
    let results = [];
    let lastTwoDiceValues = [];

    getDiceForTab().forEach((dieIndex, idx) => {
      const die = document.getElementById(`die-${dieIndex}`);
      const faceNumber = Math.floor(Math.random() * 6) + 1;
      const animationClass = animations[idx];
      die.classList.add(animationClass);

      if (dieIndex === 7 || dieIndex === 8) {
        totalNumberDice.current += faceNumber;
        lastTwoDiceValues.push(faceNumber);
      } else {
        const outcome = getOutcome(dieIndex, faceNumber);
        results.push(`${outcome}`);
      }

      setTimeout(() => {
        die.src = diceImages[dieIndex - 1][faceNumber - 1];
        die.classList.remove(animationClass);
      }, 1000);
    });

    setTimeout(() => {
      let finalResults = [
        `Total Value: ${totalNumberDice.current || 0}`,
        `${results[0]}`,
        `${results[1]}`

      ];

      if (lastTwoDiceValues.length === 2 && lastTwoDiceValues[0] === lastTwoDiceValues[1]) {
        finalResults.push("ROLL AGAIN");
      }

      setResultDisplay(finalResults);
      setIsRolling(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-800 text-white">
      <nav className="w-full bg-gray-900 p-4 shadow-md fixed top-0">
        <div className="container mx-auto flex justify-center space-x-6 relative">
          {["Start Game", "Mid Game", "End Game"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-2 font-semibold rounded ${activeTab === tab ? 'text-white' : 'text-gray-400'
                } transition-colors duration-300`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-500 transition-all duration-300"></span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center flex-grow mt-16">
        <div className="flex flex-wrap justify-center space-x-2 mt-4">
          {Array.from({ length: 8 }, (_, i) => (
            <img
              key={i}
              id={`die-${i + 1}`}
              className={`die w-20 h-20 rounded-lg shadow-md ${getDiceForTab().includes(i + 1) ? '' : 'hidden'
                }`}
              src={diceImages[i][0]}
              alt={`Die ${i + 1}`}
            />
          ))}
        </div>

        {/* Centered P tags for Results Display */}
        <div className="mt-4 text-center">


          {resultDisplay.map((line, idx) => (
            <p
              key={idx}
              className={`${idx === 0 ? "font-bold text-lg" : "text-gray-100"
                } ${idx === 3 ? "font-bold text-orange-500" : ""}`}
            >
              {line}
            </p>
          ))}



        </div>

        <button
  onClick={rollDice}
  className="mt-4 px-6 py-3 bg-gray-700 text-white font-bold uppercase rounded-lg hover:bg-gray-600 transition duration-300 flex items-center space-x-2"
  disabled={isRolling}
>
  {isRolling ? (
    <>
      <i className="fas fa-dice fa-spin"></i>
      <span>Rolling...</span>
    </>
  ) : (
    <>
      <i className="fas fa-dice"></i>
      <span>Roll Dice</span>
    </>
  )}
</button>



      </div>
    </div>
  );
}

export default App;
