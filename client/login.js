var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');

import {Link} from 'react-router';

var greetings = ['Hello!', 'Welcome', 'Hey you!', 'Greetings!', 'Hi Friend!'];
var welcomeMessage = <h1>{greetings[Math.floor(Math.random() * greetings.length)]}</h1>;

var LoginOverlay = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    var error = null;
    var isGameOver = false;
    var fbUrl = null;
    if (this.props.location.pathname.includes('gameOver')) {
      isGameOver = true;
      fbUrl = '/api/gameOver/login'
    } else {
      fbUrl = '/api/login'
    }
    if (this.props.params.error) {
      error = decodeURIComponent(this.props.params.error)
    }
    return {
      username: '',
      password: '',
      gameEnded: false,
      games: null,
      error: error,
      fbURL: fbUrl + '/facebook',
      isGameOver: isGameOver
    }
  },
  componentDidMount() {
    axios.get('/api/isUser')
      .then(function(response){
        console.log(response)
        if(response.data.isUser){
          this.context.router.goBack();
        }
      }.bind(this))
  },
  update(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  },
  login: function(e) {
    //ajax post
    axios.post('/api/login', {
      username: this.state.username,
      password: this.state.password
    }).then(function(response) {
      if (response.data.success) {

        if (this.state.isGameOver) {
          //console.log("gameOver login");
          this.context.router.push('/gameOver');
        } else {
          this.context.router.push('/home')
        }
      } else {
        this.setState({error: response.data.message});
      }
    }.bind(this))
  },
  render: function() {

    return (
      <div className="screen">
        <div className="login" id="login">
          <div className="loginContent">
            {welcomeMessage}
            <div className="pa">Login here.</div>
            <form>
              <p className="error">{this.state.error}</p>
              <br></br>
              <input type="text" placeholder="Name or Email" name="username" id="username" value={this.state.username} onChange={this.update}></input>
              <br></br>
              <input type="password" placeholder="Password" name="password" id="password" value={this.state.password} onChange={this.update}></input>
              <div className="buttongroup">

                <a className="form-btn dx" onClick={this.login} type="button">Login</a>
                <a className="fb" href={this.state.fbURL}>Login with Facebook</a>
              </div>

            </form>
          </div>
        </div>
        <div className="register-log">
          <div className="registerContent">
            <h1>New?</h1>
            <div className="pa">Register here</div>
            <h3>See your stats,
              <br></br>track your progress
              <br></br>and improve your IQ.</h3>
            <form>
              <div className="buttongroup">
                <Link className="form-btn dx registerBtn" to="/register">Register</Link>
              </div>
            </form>
            <Link to="/home"><img className="whiteLogo" src="../images/CortexIconWhite.png"/></Link>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = LoginOverlay;
