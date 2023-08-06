// App.js

import React, { useEffect, useState } from 'react';
import { fetchPokemonList } from './pokemon.jsx';
import './App.css'; 

function App() {
  const [randomPokemonList, setRandomPokemonList] = useState([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [hasLost, setHasLost] = useState(false);

  function shuffleArray(array) {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  useEffect(() => {
    getRandomPokemonData();
  }, []);

  const getRandomPokemonData = async () => {
    const allPokemonList = await fetchPokemonList();
    const randomIndices = getRandomIndices(allPokemonList.length, 5);
    const selectedPokemon = randomIndices.map(index => ({
      ...allPokemonList[index],
      clicked: false,
    }));
    setRandomPokemonList(selectedPokemon);
  };

  //just getting random 5 of 151 pokemon
  const getRandomIndices = (max, count) => {
    const indices = [];
    while (indices.length < count) {
      const randomIndex = Math.floor(Math.random() * max);
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex);
      }
    }
    return indices;
  };

  const handleCardClick = (clickedIndex) => {
    const clickedPokemon = randomPokemonList[clickedIndex];
    if (hasWon || hasLost) {
      return; // Don't allow card clicking if the game is won or lost
    }

    //reset the game when user clicks on card that has been clicked
    if (clickedPokemon.clicked) {
      const resetList = randomPokemonList.map(pokemon => ({
        ...pokemon,
        clicked: false,
      }));
      setRandomPokemonList(resetList);
      setCurrentScore(0);
      setIsFlipping(true);
  
      setTimeout(() => {
        const shuffledResetList = shuffleArray(resetList);
        setRandomPokemonList(shuffledResetList);
  
        setTimeout(() => {
          setIsFlipping(false);
        }, 100);
      }, 1500);
      setHasLost(true);

    // when user clicks on card not clicked on before
    } else {
      const updatedList = randomPokemonList.map((pokemon, index) => {
        if (index === clickedIndex) {
          return {
            ...pokemon,
            clicked: true,
          };
        }
        return pokemon;
      });
  
      setIsFlipping(true);
      
      //flip and shuffle cards
      setTimeout(() => {
        const shuffledUpdatedList = shuffleArray(updatedList);
        setRandomPokemonList(shuffledUpdatedList);
  
        setTimeout(() => {
          setIsFlipping(false);
        }, 100);
      }, 1500);
  
      if (currentScore >= bestScore) {
        if (currentScore + 1 === 5) {
          setHasWon(true);
        }
        setBestScore(currentScore + 1);
        localStorage.setItem("best-score", currentScore + 1);
      }
      setCurrentScore(currentScore + 1);
    }

  };

    return (
      <div>
        <h1>Pokemon Memory Game</h1>
        <div className='scores'>
          <div className='currentScore'>Score: {currentScore}</div>
          <div className='bestScore'>Best Score: {bestScore}</div>
        </div>
        <div className="container">
          {randomPokemonList.map((pokemon, index) => (
            <div
              key={pokemon.name}
              className={`card ${isFlipping ? 'flipped' : ''} ${pokemon.clicked ? 'clicked' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <div className="back"></div>
              <div className="front">
                <img className={`pokemon-img`} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png`} alt={pokemon.name} />
              </div>
            </div>
          ))}
        </div>
        {hasWon && (
        <div className="popup">
          <div className="popup-content">
            <h2>Congratulations! You have won the game!</h2>
            <button onClick={() => window.location.reload()}>Play Again</button>
          </div>
        </div>
      )}
      {hasLost && (
        <div className="popup">
          <div className="popup-content">
            <h2>Oops! You have lost the game!</h2>
            <button onClick={() => window.location.reload()}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
