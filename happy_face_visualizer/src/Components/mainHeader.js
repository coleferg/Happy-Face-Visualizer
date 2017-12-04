import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom'

class MainHeader extends Component {
  render() {
		let path = this.props.history.location.pathname	
    return (
			<div>
          <h1 className="App-title">Happy Face Visualizer</h1>
          <Link className={path === '/' ? "btn btn-info" : "btn btn-outline-info"} style={{marginLeft: '1em', marginRight: '1em'}} to="/">Home</Link>
          <Link className={path === '/signin' ? "btn btn-info" : "btn btn-outline-info"} style={{marginLeft: '1em', marginRight: '1em'}} to="/signin">Sign In</Link>
          <Link className={path === '/signup' ? "btn btn-info" : "btn btn-outline-info"} style={{marginLeft: '1em', marginRight: '1em'}} to="/signup">Sign Up</Link>
			</div>
		)    
  }
}

export default MainHeader;
