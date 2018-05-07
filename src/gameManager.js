import React, { Component } from 'react';
import DeckReducer from './reducerDeck';
import Player from './player';
import DeckConstant from './deckValue';
import swal from 'sweetalert';

const handValue = DeckConstant.cardValue;
class GameMananger extends Component {

	constructor(props){
		super(props);
		this.turnsNeeded = 6;
		this.currentDeck = DeckReducer();
		//this.activePlayers = [];

//each player w/ a key of playerId and value of hand which get score from
		this.players = {
			A: [],
			B: [],
			C: [],
		};
		
// State of score used to update UI
		 this.state = {
			A: 0,
			B: 0,
			C: 0,
		}
		 
		this.startGame = this.startGame.bind(this);
		this.handleScore = this.handleScore.bind(this); 
		this.roundSetup = this.roundSetup.bind(this);
		this.deleteCard = this.deleteCard.bind(this);
		this.givePlayerCard = this.givePlayerCard.bind(this);
		this.nextTurn = this.nextTurn.bind(this);
		this.dealCard = this.dealCard.bind(this);
		this.decideNextRoundPlayers = this.decideNextRoundPlayers.bind(this);
		this.renderWinner = this.renderWinner.bind(this);
	}

	startGame(){
		this.resetGame();
		const playersInGameKeys = ['A', 'B', 'C'];
		const firstDraw = [...playersInGameKeys, ...playersInGameKeys];
		for (let i = 0; i < firstDraw.length; i++) {
			const drawnCard = this.dealCard();
			const currentPlayer = firstDraw[i];
			this.givePlayerCard(currentPlayer, drawnCard);
			this.turnsNeeded--;
		}
		console.log("Game ready");
		if (this.checkForEnd()) {
			this.turnsNeeded = -1;
		}
	}

	handleScore(cards) {
		let sum = 0;
		let aceCard = 'ace';
		let hasAce= false;

		for (let i = 0; i < cards.length; i++) {
			const currentCard = cards[i];
			const cardValue = handValue[currentCard].value;
		
			if (currentCard.includes(aceCard)){
				hasAce = true;
			}
		      sum += cardValue;
		}

				if (hasAce && (sum + 10) <=  21){
						sum+= 10;	
				  }

		return sum;
	
	}

	vaildPlayers() {
		let alivePlayers = [];
		for (var player in this.players) {
			if (this.players[player] && this.handleScore(this.players[player]) < 16) {
				alivePlayers.push(player);
			}
		}
		return alivePlayers;
	}

	checkForEnd() {
		let gameHasEnded = false;
		const currentPlayers = this.players;
		let activePlayers = [];
		for (let id in currentPlayers) {

			if (currentPlayers[id]) {
				if (this.handleScore(currentPlayers[id]) < 16) {
					activePlayers.push(id);
				} 
			}
		}

		if (activePlayers.length === 0) {
			gameHasEnded = true;
		}
		return gameHasEnded;
	}

	givePlayerCard(player, card) {
		this.players[player].push(card);
		
		const newScore = this.handleScore(this.players[player]); 		
// update state
	    this.setState({
	        [player]: newScore,
	    });
	}

	dealCard() {
		let newCard = null;
		if (this.currentDeck.length > 0) {
			const randomIndex = Math.floor(Math.random() * this.currentDeck.length);
			newCard = this.currentDeck[randomIndex];
			this.deleteCard(randomIndex);
		}
		return newCard;
	}

	deleteCard(index) {
		console.log("deleteCard func");
		this.currentDeck.splice(index, 1);
	}

	decideNextRoundPlayers() {
		for (var player in this.players) {
			if (this.players[player] && this.handleScore(this.players[player]) < 16) {
				this.turnsNeeded++;
		 	}
		}
	}

	nextTurn(playerId) {
		const additionalCard = this.dealCard();
		this.givePlayerCard(playerId, additionalCard);
	}

	roundSetup() {
		console.log('new round');
		this.decideNextRoundPlayers();
		const alivePlayers = this.vaildPlayers();
		for (var i = 0; i < alivePlayers.length; i++) {
			const playerId = alivePlayers[i];
			//const playerScore = this.handleScore(this.players[playerId])
		 	this.nextTurn(playerId);
			this.turnsNeeded--;
		}

		if (this.checkForEnd()) {
			this.turnsNeeded = -1;
			console.log('hitting playerFinalScore');
		}
	}

	resetGame() {
		this.turnsNeeded = 6;
		this.currentDeck = DeckReducer();
		this.activePlayers = [];

//each player w/ a key of playerId and value of hand which get score from
		this.players = {
			A: [],
			B: [],
			C: [],
		};
		
// State of score used to update UI
		this.setState({
			A: 0,
			B: 0,
			C: 0,
		});
	}

	renderWinner(){

		const players = this.players;
		let winningPlayer = {
			player: null,
			score: 0,
		}

		for (var id in players) {
			const currentScore = this.handleScore(players[id]);
			
			if (winningPlayer.score < currentScore && currentScore <= 21) {
				winningPlayer = {
					player:id,
					score:currentScore,
				}
			}	
		}
		swal({
			  title: "Winner!",
			  text: `winner is Player ${winningPlayer.player} with a score of ${winningPlayer.score}!`,
			  button: "Ok",
			});

	}

	render() {
		if (this.turnsNeeded === 0) {
			this.roundSetup();

		} else if (this.turnsNeeded === -1) {
			// Calc for winner....
			this.renderWinner();
		}

			return (
				<div className = 'game-manager-container'>
				     <div className = 'oval-table-container'>
				    	 <div className = 'button-container'>
							<button className= 'button-container' 
							        onClick={()=>{this.startGame()}}> New Game 
							 </button> 
						 </div>
							
						<Player id='A' 
								hand={this.players.A} 
								score={this.handleScore(this.players.A)}/>

						<Player id='B' 
								hand={this.players.B} 
								score={this.handleScore(this.players.B)}/>

						<Player id='C' 
								hand={this.players.C} 
								score={this.handleScore(this.players.C)}/>
						</div>
					</div>
			
			
				);
			
	}
}

export default GameMananger;
