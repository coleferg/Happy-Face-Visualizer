import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';

class SignUp extends Component {
  constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			confirmPassword: '',
			errorMessage: ''
		}
	}

	submitUser(event) {
		event.preventDefault();
		//action?
		if (this.state.password !== this.state.confirmPassword) {
			this.setState({
				errorMessage: `Password and Confirm Password Must be the same`,
				username: this.state.username,
				password: '',
				confirmPassword: ''
			})
		}
		axios.post(`http://localhost:3030/new-user`, this.state)
			.then((returnedUser) => {
				this.props.history.push(`/signin`)
			})
			.catch((err) => {
				console.log(err)
				this.setState({
					errorMessage: `Failed to add user`,
					username: this.state.username,
					password: '',
					confirmPassword: ''
				})
			})
	}

	handleUsername(event) {
		event.preventDefault();
		this.setState({
			username: event.target.value,
			password: this.state.password,
			confirmPassword: this.state.confirmPassword,
			errorMessage: this.state.errorMessage
		})
	}

	handlePassword(event) {
		event.preventDefault();
		this.setState({
			username: this.state.username,
			password: event.target.value,
			confirmPassword: this.state.confirmPassword,
			errorMessage: this.state.errorMessage
		})
	}

	handleConfirmPassword(event) {
		event.preventDefault();
		this.setState({
			username: this.state.username,
			password: this.state.password,
			confirmPassword: event.target.value,
			errorMessage: this.state.errorMessage
		})
	}

  render() {
    return (
      <div>
          <h2 style={{ margin: '0.5em', fontSize: '1.5em', marginTop: '1.2em' }}>Sign Up</h2>
						<form onSubmit={this.submitUser.bind(this)}>
							<input class='text-input' type='username' onChange={this.handleUsername.bind(this)} placeholder='Username'></input>
							<input class='text-input' type='password' onChange={this.handlePassword.bind(this)} placeholder='Password'></input>
							<input class='text-input' type='password' onChange={this.handleConfirmPassword.bind(this)} placeholder='Confirm Password'></input>
							<button className="btn btn-outline-success" type="submit">Submit</button>
						</form>
						<p style={{color: 'red'}}>{this.state.errorMessage}</p>
      </div>
    );
  }
}
export default SignUp;
