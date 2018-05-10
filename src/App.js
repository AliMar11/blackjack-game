import React, { Component } from 'react';
import './App.css';
import GameManager from './gameManager';


class App extends Component {

  render() {
      return (  

        <div className= 'app-container'>
           <h1 className= 'title-container'>Blackjack</h1>
              <GameManager />
        </div>
      );
    }
}

export default App;
