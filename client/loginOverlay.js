var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');

import {Link} from 'react-router';

var LoginOverlay = React.createClass({
  getInitialState: function() {
    console.log(this)
    // var error = null;
    // if(this.props.params.error){
    //   error = decodeURIComponent(this.props.params.error)
    // }
    return {
      username: '', 
      password: '', 
      gameEnded: false, 
      games: null,
      error: this.props.params.error,
      fbURL: this.props.location.pathname+'/facebook'
    }


  },
  componentDidMount() {},
  update(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  },
  login: function(e) {
    //e.preventDefault();

    console.log("logging in")
    console.log(this.props)

    //ajax post
    axios.post('/login', {
      username: this.state.username,
      password: this.state.password
    }).then(function(response) {
      console.log("response: "+response)
      if (response.data.success) {
        
        if(this.props.location.pathname.includes('gameOver/login')){
          this.props.history.goBack();
        }
        else{
          this.props.history.push('/home')
        }
      }
      else{
        this.props.history.push('/login/error')
      }
    }.bind(this))
  },

  render: function() {
    return (
      <div className="screen">
        <div className="login" id="login">

          <div className="loginContent">
            <h1>Hey you!</h1>
            <div className="pa">Login here.</div>
            <form>
              {this.state.error}
              <input type="text" placeholder="Name or Email" name="username" id="username" value={this.state.username} onChange={this.update}></input>
              <br></br>
              <input type="password" placeholder="Password" name="password" id="password" value={this.state.password} onChange={this.update}></input>
              <div className="buttongroup">

                <Link to="/home">
                  <button className="form-btn dx" onClick={this.login}>Login</button>
                </Link>
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
                <Link to="/register">
                  <button className="form-btn dx">
                    Register
                  </button>
                </Link>
              </div>
            </form>
            <Link to="/home"><img className="whiteLogo" src="./images/CortexIconWhite.png"/></Link>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = LoginOverlay;
