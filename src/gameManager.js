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

//each player gets a key of playerId and value of hand which is where we hold their score
		this.players = {
			A: [],
			B: [],
			C: [],
		};
		
//state of score used to update UI
		 this.state = {
			A: 0,
			B: 0,
			C: 0,
		}	

		this.givePlayerCard = this.givePlayerCard.bind(this);
	}

//reset game, count number of players for the new game and hand everyone 2 cards.
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

//if all player hand => 21, no one needs another turn, so end the game		
		if (this.checkForEnd()) {
			this.turnsNeeded = -1;
		}
	}

//calculate player score, check for aces and make ace == 11 points if it won't cause hand > 21
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

//check if players need another card
	vaildPlayers() {
		let alivePlayers = [];
		for (var player in this.players) {
			if (this.players[player] && this.handleScore(this.players[player]) < 16) {
				alivePlayers.push(player);
			}
		}
		return alivePlayers;
	}

//if all player hand => 21, no one needs another turn, so end the game
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

//deal a new card from deck, then remove the selected card from deck 
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

//decide, based on current score, if players need a new card
	decideNextRoundPlayers() {
		for (var player in this.players) {
			if (this.players[player] && this.handleScore(this.players[player]) < 16) {
				this.turnsNeeded++;
		 	}
		}
	}

//deal a new card and give it to player
	nextTurn(playerId) {
		const additionalCard = this.dealCard();
		this.givePlayerCard(playerId, additionalCard);
	}

//set up the next round, where we check for players that need another card
	roundSetup() {
		console.log('new round');
		this.decideNextRoundPlayers();
		const alivePlayers = this.vaildPlayers();
		for (var i = 0; i < alivePlayers.length; i++) {
			const playerId = alivePlayers[i];
		 	this.nextTurn(playerId);
			this.turnsNeeded--;
		}

//if all player hand => 21, no one needs another turn, so end the game
		if (this.checkForEnd()) {
			this.turnsNeeded = -1;
			console.log('hitting playerFinalScore');
		}
	}

	resetGame() {
		this.turnsNeeded = 6;
		this.currentDeck = DeckReducer();
		this.activePlayers = [];

//reset players hand and player score
		this.players = {
			A: [],
			B: [],
			C: [],
		};
		
		this.setState({
			A: 0,
			B: 0,
			C: 0,
		});
	}

//callculates winning hand
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

//alert to demonstrate the outcome of the game		
		swal({
			  title: "Winner!",
			  text: `winner is Player ${winningPlayer.player} with a score of ${winningPlayer.score}!`,
			  button: "Ok",
			});

	}

	render() {
//if all players are ready to begin round, call roundSetup		
		if (this.turnsNeeded === 0) {
			this.roundSetup();

//if we should not play another round due to a winning hand of 21, or 2 out of 3 player's score > 21
		} else if (this.turnsNeeded === -1) {
// Calc for winner
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
