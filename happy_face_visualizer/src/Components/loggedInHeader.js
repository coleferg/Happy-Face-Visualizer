import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom'

class LoggedInHeader extends Component {
	constructor(props) {
		super(props)
		this.state = {
			currentUser: ''
		}
	}

	componentDidMount() {
		let loggedIn = localStorage.getItem('loggedIn')
		if (loggedIn !== 'true') {
			this.props.history.push('/')
		}
		let bookworm = localStorage.getItem('username')
		this.setState({
			currentUser: bookworm
		})
	}

	handleLogout(e) {
		console.log('goodbye', this.state.currentUser)
		localStorage.removeItem("loggedIn");
		localStorage.removeItem("username");
		localStorage.removeItem("userID");
		localStorage.removeItem("songID");
		this.props.history.push('/')
	}

  render() {
		let path = this.props.history.location.pathname
    return (
			<div>
				<h1 className="App-title">{this.state.currentUser}'s Happy Face Visualizer</h1>
        <Link className={path === '/songs' ? "btn btn-info" : "btn btn-outline-info"} style={{marginLeft: '1em', marginRight: '1em'}} to="/songs">Songs</Link>
        <Link className={path === '/newsong' ? "btn btn-info" : "btn btn-outline-info"} style={{marginLeft: '1em', marginRight: '1em'}} to="/newsong">Add New Song</Link>
				<button onClick={this.handleLogout.bind(this)}  style={{marginLeft: '1em', marginRight: '1em'}} className="btn btn-outline-danger">Log-out</button>
			</div>
		)    
  }
}

export default LoggedInHeader;
