import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import './App.css';
import Home from './Components/home';
import SignIn from './Components/signin';
import SignUp from './Components/signup';
import Songs from './Components/songs';
import NewSong from './Components/newSong';
import MainHeader from './Components/mainHeader';
import LoggedInHeader from './Components/loggedInHeader';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div>
            <Route exact path='/' component={MainHeader}/>
            <Route exact path='/signin' component={MainHeader}/>
            <Route exact path='/signup' component={MainHeader}/>
            <Route exact path='/songs' component={LoggedInHeader}/>
            <Route exact path='/newsong' component={LoggedInHeader}/>
            <Route exact path='/' component={Home}/>
            <Route path='/signin' component={SignIn}/>
            <Route path='/signup' component={SignUp}/>
            <Route path='/songs' component={Songs}/>
            <Route path='/newsong' component={NewSong}/>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
