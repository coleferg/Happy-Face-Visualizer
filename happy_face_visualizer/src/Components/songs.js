import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';

class Songs extends Component {
  constructor(props) {
		super(props);
		this.state = {
			songs: [
				{ title: 'Catching Up', id: 'scurryukybvytjhg', songURL: './catching_up.mp3', voxURL: './catching_up_vox.mp3' },
			],
			activeSong: {
				id: null
			}
		}
	}
	
	componentDidMount() {
		// { title: song.title, id: song._id, songURL: song.songURL, voxURL: song.voxURL }
		const userID = localStorage.getItem('userID');
		axios.get(`http://localhost:3030/${userID}/songs`)
			.then((usersSongs) => {
				console.log('songs from user ----->', usersSongs.data)
				let stateSongs = this.state.songs.slice()
				usersSongs.data.forEach((track) => {
					stateSongs.push(track)
				})
				this.setState({
					songs: stateSongs,
					activeSong: this.state.activeSong
				})
			})
			.catch((err) => {
				alert(`Error getting songs, are you logged in?`)
				console.log(err)
			})
	}

	handleSong(event) {
		let index = Number(event.target.value)
		this.setState({
			songs: this.state.songs,
			activeSong: {
				id: index
			}
		})
		localStorage.setItem('songID', this.state.songs[index].id);
		// localStorage.setItem('songURL', this.state.songs[index].songURL);
		// localStorage.setItem('voxURL', this.state.songs[index].voxURL);
	}

  render() {
    return (
      <div>
				<form>
					{/* map out songs like this */}
					{this.state.songs.map((song, i) => {
						return (
							<div className='songlist' key={i}>
								<input className='songs' key={i} checked={this.state.activeSong.id === i} onChange={this.handleSong.bind(this)} type="radio" name='song' value={i}/>{song.title}
							</div>
						)
					})}
				</form>
      </div>
    );
  }
}

export default Songs;
