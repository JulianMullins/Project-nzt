var React = require('react');
var ReactDOM = require('react-dom');
var url = process.env.url;


var MenuOverlay = React.createClass({
  render: function() {
    return (
      <div className="overlay">
        <center>
          <a className="btn" href="" onClick={this.props.start}>Start</a>
          <a className="btn" href="" onClick={this.props.loginScreen}>Login</a>
        </center>
      </div>
    )
  }
})

var LoginOverlay = React.createClass({
  render: function() {
    return (
      <div className="overlay" id="login">
        <center>
          <form>
            <input type="text" placeholder="username" name="username" id="username"></input>
            <br></br>
            <input type="password" placeholder="password" name="password" id="password"></input>
            <br></br>
            <button onClick={this.props.login}>Login</button>
            <br></br>
            <a type="button" href="/login/facebook">Login with Facebook</a>
            <br></br>
            <button onClick={this.props.registerScreen}>Register</button>
            <br></br>
            <button onClick={this.props.back} className="back">Back</button>
          </form>
        </center>
      </div>
    )
  }
});

var RegisterOverlay = React.createClass({
  render: function() {
    return (
      <div className="overlay" id="login">
        <center>
          <form>
            <input type="text" placeholder="username" name="username" id="username"></input>
            <br></br>
            <input type="text" placeholder="email" name="email" id="email"></input>
            <br />
            <input type="password" placeholder="password" name="password" id="password"></input>
            <br></br>
            <input type="password" placeholder="confirm password" name="passwordConfirm" id="passwordConfirm"></input>
            <br></br>
            <button onClick={this.props.register}>Register</button>
            <br></br>
            <button onClick={this.props.back} className="back">Already have an account?</button>
          </form>
        </center>
      </div>
    )
  }
});

var Mainmenu = React.createClass({

  //initial functions
  getInitialState: function() {
    return {
      menu: true,
      login: false,
      register: false,
      mode: {
        position: true,
        sound: true,
        color: false
      }
    }
  },
  componentDidMount: function(){
    fetch('/isLoggedIn',{
      method:'get',
      credentials: 'include'
    }).then(function(response){
        return response.json();
    }).then(function(response){
      if(response.loggedIn){
        this.start({preventDefault:function(){}});
      }
    }.bind(this))
  },

  //functions related to login/registration/main menu
  start: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: false, register: false});
  },
  loginScreen: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: true, register: false})
  },
  login: function(e) {
    e.preventDefault();

    //ajax post
    fetch('/login', {
    	method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    	body: JSON.stringify({
    		username: document.getElementById('username').value,
    		password: document.getElementById('password').value
    	})
    }).then(function(response){
        return response.json();
    }).then(function(response){
      if(response.success){
        this.setState({menu: false, login: false, register: false})
      }
      else if(!response.success){

      }
    }.bind(this))
  },


  facebook: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: false, register: false});

    //ajax facebook get


    fetch('/login/facebook', {
    	method: 'get'
    })

  },
  registerScreen: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: false, register: true})
  },
  register: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: false, register: false});

    //ajax post
    fetch('/register', {
    	method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    	body: JSON.stringify({
    		username: document.getElementById('username').value,
        email: document.getElementById('email').value,
    		password: document.getElementById('password').value,
        passwordConfirm: document.getElementById('passwordConfirm').value
    	})
    });

  },
  back: function(e) {
    e.preventDefault();
    this.setState({menu: true, login: false, register: false})
  },

  //set mode
  normalMode: function(e) {
    e.preventDefault();
    this.setState({
      mode: {
        position: true,
        sound: true,
        color: false
      }
    }, this.goToGame);
  },
  posOnly: function(e) {
    e.preventDefault();
    this.setState({
      mode: {
        position: true,
        sound: false,
        color: false
      }
    }, this.goToGame);
  },
  posAndColor: function(e) {
    e.preventDefault();
    this.setState({
      mode: {
        position: true,
        sound: false,
        color: true
      }
    }, this.goToGame);
  },
  advanced: function(e) {
    e.preventDefault();
    this.setState({
      mode: {
        position: true,
        sound: true,
        color: true
      }
    }, this.goToGame);
  },

  //start game
  goToGame: function() {
    ReactDOM.render(
      <Game mode={this.state.mode}></Game>, document.getElementById('root'));
  },


  render: function() {
    var menu = this.state.menu
      ? <MenuOverlay start={this.start} loginScreen={this.loginScreen} registerScreen={this.registerScreen}></MenuOverlay>
      : '';
    var login = this.state.login
      ? <LoginOverlay login={this.login} back={this.back} registerScreen={this.registerScreen} facebook={this.facebook}></LoginOverlay>
      : '';
    var register = this.state.register
      ? <RegisterOverlay register={this.register} back={this.loginScreen}></RegisterOverlay>
      : '';
    return (
      <div>
        <div className="heading">
          <h1 id="title">Reflex</h1>
          <h3>WE MAKE YOU FUCKING BETTER</h3>
        </div>
        <div className="menu">
          <a href="" className="menu-panel" id="menu1" onClick={this.normalMode}>
            <h2>Classic</h2>
            <h3>(position, sound)</h3>
          </a>
          <a href="" className="menu-panel" id="menu2" onClick={this.posOnly}>
            <h2>Relaxed</h2>
            <h3>(position only)</h3>
          </a>
          <a href="" className="menu-panel" id="menu3" onClick={this.posAndColor}>
            <h2>Silent</h2>
            <h3>(position, color)</h3>
          </a>
          <a href="" className="menu-panel" id="menu4" onClick={this.advanced}>
            <h2>Advanced</h2>
            <h3>(color, position, sound)</h3>
          </a>
        </div>
      </div>
    );
  }
});

module.exports = {
  MenuOverlay: MenuOverlay,
  LoginOverlay: LoginOverlay,
  RegisterOverlay:RegisterOverlay,
  Mainmenu: Mainmenu
}
