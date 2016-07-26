var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');

import {Link} from 'react-router';

var LoginOverlay = React.createClass({
  getInitialState: function() {
    console.log(this)
    return {
      username: '',
      password: '',
      gameEnded:false,
      games:null
    }
  },
  // componentDidMount(){

  //     fetch('/getUser',{
  //       method:'get'
  //     }).then(function(response){
  //         console.log("about to response.json")
  //         return response.json();
  //     }).then(function(response){
  //       console.log('responded')
  //       if(response.games){
  //         console.log('about to set state')
  //         this.setState({
  //           games:response.games
  //         })
  //         console.log('state set')
  //       }
  //     }.bind(this))


  // },
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
     //withCredentials:true,
      // headers: {
      //   'Accept': 'application/json',
      //   'Content-Type': 'application/json'
      // },
      
        username: this.state.username,
        password: this.state.password
      
    }).then(function(response) {
      console.log("response")
      if (response.data.success) {
        this.props.history.push('/home');
      } 
    }.bind(this))
  },
  facebook: function(e) {
    e.preventDefault();

    //ajax facebook get

    // fetch('/login/facebook',{method:'get'
    // }).then(function(response) {
    //   console.log(response);
    //     return response.json();
    //   }).then(function(response) {
    //     console.log(response);
    //     if (response.success) {
    //       this.props.history.push('/home');
    //     }
    //   }.bind(this))

    // axios({
    //   url:'/login/facebook',
    //   withCredentials:true
    // })

  },
  render: function() {
    return (
      <div className="screen">
                    

        <div className="login" id="login">
          <h1>Hey you!</h1>
          <div className="pa">Login here.</div>
          <form>
            <input type="text" placeholder="Name or Email" name="username" id="username" value={this.state.username} onChange={this.update} autoFocus={focus}></input>
            <br></br>
            <input type="password" placeholder="Password" name="password" id="password" value={this.state.password} onChange={this.update}></input>
            <div className="buttongroup">
              <Link to="/home" type="button" className="form-btn dx" onClick={this.login}>Login</Link>
              <a href="/login/facebook" >Login with Facebook</a>
            </div>
            
          </form>
        </div>
        <div className="register-log">
          <h1>New?</h1>
          <div className="pa">
            <Link to="/register">Register here.</Link>
          </div>
          <h3>See your stats,
            <br></br>track your progress,
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
        </div>
      </div>
    )
  }
});

module.exports = LoginOverlay;
