var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');
import { Link } from 'react-router';

var RegisterOverlay = React.createClass({
  getInitialState(){
    return{
      username:'',
      email:'',
      password:'',
      passwordConfirm:'',
      name:'',
      gameEnded:false,
      error:this.props.params.error
    }
  },
  componentDidMount(){
    if(this.props.location.pathname =='/gameOver/register'){

      this.setState({
        gameEnded:true
      })

    }

  },
  // click(e){
  //   e.preventDefault();
  //   if(this.state.gameEnded){
  //     this.gameEnded();
  //   }
  //   else{
  //     this.register()
  //   }
  // },
  update(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  },
  // gameEnded(){
  //   //ajax post
  //   fetch('/register', {
  //     method: 'post',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       username: this.state.username,
  //       email: this.state.email,
  //       password: this.state.password,
  //       passwordConfirm: this.state.passwordConfirm}),
  //       games:this.state.games
  //   }).then(function(response){
  //     return response.json();
  //   }).then(function(response){
  //     if(response.success){
  //       this.props.history.push('/gameOver')
  //     }
  //   });
  // },
  register: function(e) {
    e.preventDefault();
    //ajax post
    console.log(this)
    axios.post('/register', {
      // headers: {
      //   'Accept': 'application/json',
      //   'Content-Type': 'application/json'
      // },
      // withCredentials:true,
      // data: {
        username: this.state.username,
        name:this.state.name,
        email: this.state.email,
        password: this.state.password,
        passwordConfirm: this.state.passwordConfirm
      // }
    }).then(function(response){
      console.log(response)
      if(response.data.success){
        console.log("registration successful")
        //this.props.history.push('/login')


        axios.post('/login', {
          username: this.state.email,
          password: this.state.password
        }).then(function(response){
          console.log(response)
          if(response.data.success){
            if(!this.state.gameEnded){
              this.props.history.push('/home')
            }
            else{
              this.props.history.goBack();
            }
          }
          else{
            this.props.history.push('/login/error')
          }
        }.bind(this))


      }
      else{
        this.props.history.push('/register/error')
      }
    }.bind(this));


  },
  render: function() {
    return (
      <div className="screen">
        <div className="register" id="login">
          <h1>Welcome</h1>
          <div className="pa">Create an account to get started.</div>
          <form>
            {this.state.error}
            <input type="text" placeholder="Name" name="name" id="name" value={this.state.name} onChange={this.update}></input>
            <br></br>
            <input type="text" placeholder="Username" name="username" id="username" value={this.state.username} onChange={this.update}></input>
            <br></br>
            <input type="text" placeholder="Email" name="email" id="email" value={this.state.email} onChange={this.update}></input>
            <br/>
            <input type="password" placeholder="Password" name="password" id="password" value={this.state.password} onChange={this.update}></input>
            <br></br>
            <input type="password" placeholder="Confirm password" name="passwordConfirm" id="passwordConfirm" value={this.state.passwordConfirm} onChange={this.update}></input>
            <div className="buttongroup">
              <button className="form-btn dx" onClick={this.register}><Link to="/">Register</Link></button>
              <button className="form-btn dx2"><Link to="/login">Back to Login</Link></button>
            </div>
          </form>
        </div>
                <Link to="/home"><img className="whiteLogo" src="./images/CortexIconWhite.png" /></Link>
      </div>
    )
  }
});

module.exports=RegisterOverlay;
