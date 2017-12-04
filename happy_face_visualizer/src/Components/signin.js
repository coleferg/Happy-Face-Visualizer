import React, { Component } from 'react';
import '../App.css';
import axios from 'axios'

class SignIn extends Component {
  constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			error: ''
		}
	}

	submitUser(event) {
		event.preventDefault();
		if (this.state.username.length === 0 || this.state.password.length === 0) {
			this.setState({
				username: this.state.username,
				password: this.state.password,
				error: 'You need to provide your username and password!'
			})
			return;
		}
		axios.post(`http://localhost:3030/login`, this.state)
			.then((returnedUser) => {
				console.log(returnedUser)
				const userID = returnedUser.data._id
				localStorage.setItem('userID', userID)
				localStorage.setItem('username', this.state.username)
				localStorage.setItem('loggedIn', 'true')
				this.props.history.push(`/songs`)
			})
			.catch((err) => {
				this.setState({
					username: this.state.username,
					password: this.state.password,
					error: 'Username/Password do not match'
				})
			})
	}

	handleUsername(event) {
		event.preventDefault();
		this.setState({
			username: event.target.value,
			password: this.state.password,
			error: this.state.error
		})
	}

	handlePassword(event) {
		event.preventDefault();
		this.setState({
			username: this.state.username,
			password: event.target.value,
			error: this.state.error
		})
	}

  render() {
    return (
      <div>
          <h2 style={{ margin: '0.5em', fontSize: '1.5em', marginTop: '1.2em' }}>Sign In</h2>
						<form onSubmit={this.submitUser.bind(this)}>
							<input class='text-input' type='username' onChange={this.handleUsername.bind(this)} placeholder='username'></input>
							<input class='text-input' type='password' onChange={this.handlePassword.bind(this)} placeholder='password'></input>
							<button style={{ marginLeft: '.5em' }} className="btn btn-outline-success" type="submit">Submit</button>
						</form>
						<p style={{color: 'red'}}>{this.state.error}</p>
      </div>
    );
  }
}

export default SignIn;
