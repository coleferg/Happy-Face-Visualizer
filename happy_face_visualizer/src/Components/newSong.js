import React, { Component } from 'react';
import '../App.css';
import axios from 'axios'

class NewSong extends Component {
  constructor(props) {
		super(props);
		this.state = {
			title: '',
			songURL: '',
			voxURL: '',
			errorMessage: ''
		}
	}

	submitSong(event) {
		event.preventDefault();
		const userLoggedIn = localStorage.getItem('userID');
		let song = {
			songURL: this.state.songURL,
			title: this.state.title,
			voxURL: this.state.voxURL,
			creator: userLoggedIn
		};
		if (this.state.title.length === 0 || this.state.songURL.length === 0 || this.state.voxURL.length === 0) {
			this.setState({
				title: this.state.title,
				songURL: this.state.songURL,
				voxURL: this.state.voxURL,
				errorMessage: `You gotta provide all fields, URL's have not been implemented yet so submit any URL for both URL fields`
			})
			return;
		}
		axios.post(`http://localhost:3030/new-song`, song)
			.then((songBack) => {
				this.props.history.push('/songs')
			})
			.catch((err) => {
				this.setState({
					title: this.state.title,
					songURL: this.state.songURL,
					voxURL: this.state.voxURL,
					errorMessage: `You gotta provide all fields, URL's have not been implemented yet so submit any URL for both URL fields`
				})
			})
	}

	handleTitle(event) {
		event.preventDefault();
		this.setState({
			title: event.target.value,
			songURL: this.state.songURL,
			voxURL: this.state.voxURL,
			errorMessage: this.state.errorMessage
		})
	}

	handleSongURL(event) {
		event.preventDefault();
		this.setState({
			title: this.state.title,
			songURL: event.target.value,
			voxURL: this.state.voxURL,
			errorMessage: this.state.errorMessage
		})
	}

	handleVoxURL(event) {
		event.preventDefault();
		this.setState({
			title: this.state.title,
			songURL: this.state.songURL,
			voxURL: event.target.value,
			errorMessage: this.state.errorMessage
		})
	}

  render() {
    return (
      <div>
          <h2 style={{ margin: '0.5em', fontSize: '1.5em', marginTop: '1.2em' }}>Add a New Song</h2>
					<form onSubmit={this.submitSong.bind(this)}>
						<input class='text-input' type='text' onChange={this.handleTitle.bind(this)} placeholder='Title'></input>
						<input class='text-input' type='text' onChange={this.handleSongURL.bind(this)} placeholder='Song URL (.mp3)'></input>
						<input class='text-input' type='text' onChange={this.handleVoxURL.bind(this)} placeholder='Vocal Track URL (.mp3)'></input>
						<button style={{ marginLeft: '.5em' }} className="btn btn-outline-success" type="submit">Submit</button>
					</form>
					<p style={ { color: 'red' } } >{this.state.errorMessage}</p>
      </div>
    );
  }
}

export default NewSong;
