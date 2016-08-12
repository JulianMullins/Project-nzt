var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');
import { Link } from 'react-router';

var RegisterOverlay = React.createClass({
  getInitialState(){
    var error = null;
    if(this.props.params.error){
      error = decodeURIComponent(this.props.params.error);
    }
    return{
      username:'',
      email:'',
      password:'',
      passwordConfirm:'',
      name:'',
      gameEnded:false,
      error:error
    }
  },
  componentDidMount(){
    

  },
  update(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  },
  register: function(e) {
    e.preventDefault();
    //ajax post
    console.log(this)
    axios.post('/api/register', {
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


        axios.post('/api/login', {
          username: this.state.email,
          password: this.state.password
        }).then(function(response){
          console.log(response)
          if(response.data.success){
            if(this.props.location.pathname.includes('/gameOver')){
              this.props.history.push('/gameOver')
            }
            else{
              this.props.history.push('/home')
            }
          }
          else{
            this.props.history.push('/login/'+encodeURIComponent(response.data.message))
          }
        }.bind(this))


      }
      else{
        console.log("failed register")
        var errors = response.data.message;
        if(typeof(errors)!=='string'){
          errors=response.data.message.join(' • ')
        }
        this.setState({error:errors})
      }
    }.bind(this));
  },
  render: function() {
    return (
      <div className="screen">
        <div className="register" id="login">
          <h1>Welcome</h1>
          <div className="pa">Create an account to get started.</div>
            <div className="errorDiv">
              {this.state.error}
            </div>
          <form>
            <br />
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
              <button className="form-btn dx" onClick={this.register}>Register</button>
              <Link to="/login"><button className="form-btn dx2">Back to Login</button></Link>
            </div>
          </form>
        </div>
                <Link to="/home"><img className="whiteLogo" src="./images/CortexIconWhite.png" /></Link>
      </div>
    )
  }
});

module.exports=RegisterOverlay;
