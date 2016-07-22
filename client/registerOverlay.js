var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router';

var RegisterOverlay = React.createClass({
  getInitialState(){
    return{
      username:'',
      email:'',
      password:'',
      passwordConfirm:'',
      gameEnded:false,
      games:null
    }
  },
  componentDidMount(){
    if(this.props.location.pathname =='/gameOver/register'){
      
      this.setState({
        gameEnded:true
      })

      fetch('/getUser',{
        method:'get'
      }).then(function(response){
          return response.json();
      }).then(function(response){
        if(response.games){
          this.setState({
            gameId:response.games
          })
        }
      }.bind(this))
    }
    
  },
  click(e){
    if(this.state.gameEnded){
      this.gameEnded();
    }
    else{
      this.register()
    }
  },
  update(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  },
  gameEnded(){
    e.preventDefault();

    //ajax post
    fetch('/register', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        passwordConfirm: this.state.passwordConfirm}),
        games:this.state.games
    }).then(function(response){
      return response.json();
    }).then(function(response){
      if(response.success){
        this.history.push('/gameOver')
      }
    });
  },
  register: function(e) {
    e.preventDefault();

    //ajax post
    fetch('/register', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        passwordConfirm: this.state.passwordConfirm}),
        games:[]
    }).then(function(response){
      return response.json();
    }).then(function(response){
      if(response.success){
        this.history.push('/home')
      }
    });


  },
  render: function() {
    return (
      <div className="screen">
        <div className="register" id="login">
          <h1>Welcome</h1>
          <div className="pa">Create an account to get started.</div>
          <form>
            <input type="text" placeholder="username" name="username" id="username" value={this.state.username} onChange={this.update}></input>
            <br></br>
            <input type="text" placeholder="email" name="email" id="email" value={this.state.email} onChange={this.update}></input>
            <br/>
            <input type="password" placeholder="password" name="password" id="password" value={this.state.password} onChange={this.update}></input>
            <br></br>
            <input type="password" placeholder="confirm password" name="passwordConfirm" id="passwordConfirm" value={this.state.passwordConfirm} onChange={this.update}></input>
            <div className="buttongroup">
              <button className="form-btn dx" onClick={this.click}><Link to="/">Register</Link></button>
              <button className="form-btn dx2"><Link to="/login">Back to Login</Link></button>
            </div>
          </form>
        </div>
      </div>
    )
  }
});

module.exports=RegisterOverlay;
