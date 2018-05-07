import React, { Component } from 'react';
import constant from './deckValue';

const handValue = constant.cardValue;

class Player extends Component {

	constructor(props){
		super(props);
	}

	handleCardImage(card) {
		return handValue[card].url;
	}

	render() {

		const listItems = this.props.hand.map((card) =>
  			<li key={card} className='card-image-container'><div><img src={this.handleCardImage(card)} /></div></li>
		);
		return (
			<div className = {`player-${this.props.id}-container`}>

			<div className = 'player-name-container'> Player {this.props.id} </div>
			<div className = 'player-score-container'>  Score:{this.props.score} </div>
			<div className = 'cards-container' />

				 <ul>{listItems}</ul>
			</div>
			);
	}
}

export default Player;

