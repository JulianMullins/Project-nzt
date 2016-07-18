var React = require('react');
var ReactDOM = require('react-dom');
var url = process.env.url

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
  getInitialState: function(){
    return{
      username:null,
      password:null
    }
  },
  update(e){
    if(e.target.name == 'username'){
      this.setState({username:e.target.value})
    }
    else if(e.target.name == 'password'){
      this.setState({password:e.target.value})
    }
  }
  render: function() {
    return (
      <div className="overlay" id="login">
        <center>
          <form onSubmit={this.ajaxLogin}>
            <input type="text" name="username" id="username" placeholder="email" value={this.state.username} onChange={this.update}></input>
            <br></br>
            <input type="password" name="password" id="password" placeholder="password" value={this.state.password} onChange={this.update}></input>
            <br></br>
            <button onClick={this.props.login}>Login</button>
            <br></br>
            <button onClick={this.props.register}>Register</button>
            <br></br>
            <button onClick={this.props.facebook}>Login with Facebook</button>
            <br></br>
            <button onClick={this.props.back} id="back">Back</button>
          </form>
        </center>
      </div>
    )
  }
});

var Mainmenu = React.createClass({
  getInitialState: function() {
    return {
      menu: true,
      login: false,
      mode: {
        position: true,
        sound: true,
        color: false
      }
    }
  },
  start: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: false});
  },
  login: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: true})

  },
  register:function(){
    e.preventDefault();
    
  },
  facebook:function(){

  },
  login: function(e) {
    e.preventDefault();
    this.setState({menu: false, login: false});
    fetch(url+'/login', {
    	method: 'post',
    	body: JSON.stringify({
    		username: document.getElementById('username').value
    		password: document.getElementById('password').value
    	})
    })..catch(function(err) {
    	console.log("error logging in")
    });
  },
  back: function(e) {
    e.preventDefault();
    this.setState({menu: true, login: false})
  },
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
  goToGame: function() {
    ReactDOM.render(
      <Game mode={this.state.mode}></Game>, document.getElementById('root'));
    console.log(this.state.mode);
  },
  render: function() {
    var menu = this.state.menu
      ? <MenuOverlay start={this.start} loginScreen={this.loginScreen}></MenuOverlay>
      : '';
    var login = this.state.login
      ? <LoginOverlay login={this.login} register={this.register} facebook={this.facebook} back={this.back}></LoginOverlay>
      : '';
    return (
      <div>
        {menu}
        {login}
        <center>
          <h1 id="title">Project NZT</h1>
        </center>
        <div className="menu">
          <a href="" className="menu-panel" onClick={this.normalMode}>
            <h2>normal</h2>
            <h3>(position, sound)</h3>
          </a>
          <a href="" className="menu-panel" onClick={this.posOnly}>
            <h2>position-only</h2>
          </a>
        </div>
        <div className="menu">
          <a href="" className="menu-panel" onClick={this.posAndColor}>
            <h2>position & color</h2>
          </a>
          <a href="" className="menu-panel" onClick={this.advanced}>
            <h2>advanced</h2>
            <h3>(color, position, sound)</h3>
          </a>
        </div>
      </div>
    );
  }
});

<<<<<<< HEAD
// var Game = React.createClass({
//   getInitialState: function() {
//     return {
//      style: [standardStyle,standardStyle,standardStyle,standardStyle,standardStyle,standardStyle,standardStyle,standardStyle,standardStyle],
//      match: false
//     }
//   },
//    test: function(){
//     var out=[];
//     setInterval(function(){
//     //start with forced match command
//     if(out.length===12){
//       (console.log('forced match'))
//       out.push(out[out.length-1])
//       this.state.style[out[out.length-1]]=newStyle;
//       this.setState({
//         style: this.state.style
//       })
//       console.log('match');
//       setTimeout(function(){
//         this.state.style[out[out.length-1]]=standardStyle;
//         this.setState({
//         style: this.state.style
//       })
//         out=[]
//     }.bind(this),500);
//   }
//   else{
//     console.log('not forced match')
//     out.push(parseInt(Math.random()*9));
//     console.log('game', out)
//     this.state.style[out[out.length-1]]=newStyle;
//     this.setState({
//       style: this.state.style
//     })
//     //pause for thinking/processing time
//   if(out.length>1){
//       if(out[out.length-1]===out[out.length-2]){
//         console.log('match');
//         setTimeout(function(){
//         this.state.style[out[out.length-1]]=standardStyle;
//         this.setState({
//           style: this.state.style
//          })
//         out=[];
//       }.bind(this),500)
//       }
//       else{
//         console.log('no match')
//         setTimeout(function(){
//         this.state.style[out[out.length-1]]=standardStyle;
//         this.setState({
//           style: this.state.style
//         })
//         }.bind(this),500);
//       }
//     };
//     if(out.length===1){
//       setTimeout(function(){
//         this.state.style[out[out.length-1]]=standardStyle;
//         this.setState({
//           style: this.state.style
//         })
//         }.bind(this),500);
//     }
//   }
// }.bind(this),3000)
//   },
// 	render: function() {
// 		return (
// 			<div className="gameContainer">
// 				<div className="gameRow">
// 					<div id="square1" className="gameSquare" style={this.state.style[0]}></div>
// 					<div id="square2" className="gameSquare" style={this.state.style[1]}></div>
// 					<div id="square3" className="gameSquare" style={this.state.style[2]}></div>
// 				</div>
// 				<div className="gameRow">
// 					<div id="square4" className="gameSquare" style={this.state.style[3]}></div>
// 					<div id="square5" className="gameSquare" style={this.state.style[4]}></div>
// 					<div id="square6" className="gameSquare" style={this.state.style[5]}></div>
// 				</div>
// 				<div className="gameRow">
// 					<div id="square7" className="gameSquare" style={this.state.style[6]}></div>
// 					<div id="square8" className="gameSquare" style={this.state.style[7]}></div>
// 					<div id="square9" className="gameSquare" style={this.state.style[8]}></div>
// 				</div>
// 				<div className="gameButtonsContainer">
// 					<a>Sound</a>
// 					<a>Both</a>
// 					<a>Position</a>
// 				</div>
//         <button onClick={this.test}>Start</button>
// 			</div>
// 		);
// 	}
// });
=======

var GameTimer = React.createClass({
	getInitialState: function() {
		return {
			seconds: 120
		}
	},

	componentDidMount: function() {
		setTimeout(function() {this.setState({interval: setInterval(this.timerSecs, 1000)})}.bind(this), 3000);
	},
	timerSecs: function() {
		this.setState({
			seconds: this.state.seconds-1
		})
		if(this.state.seconds === 0) {
			clearInterval(this.state.interval);
		}
	},
	render: function() {
		return (
			<div className="timerContainer">
				<h1 className="gameTimer">{Math.floor(this.state.seconds/60)}:{("0" + this.state.seconds % 60).slice(-2)}</h1>
			</div>
		)
	}
});

>>>>>>> refs/remotes/origin/master
var Game = React.createClass({
  getInitialState: function() {
    return {
     style: [standardStyle,standardStyle,standardStyle,standardStyle,standardStyle,standardStyle,standardStyle,standardStyle,standardStyle],
     match: false,
     score: 0,
     miss: false,
<<<<<<< HEAD
     alert: " "
    }
=======
     alert: " ",
     overlay: true,
     initialTimer: 3
    }
>>>>>>> refs/remotes/origin/master
  },
	componentDidMount: function() {
		setInterval(this.timer, 1000);
	},
	timer: function() {
		this.setState({
			initialTimer: this.state.initialTimer-1
		})
		if(this.state.initialTimer === 0) {
			this.setState({
				overlay: false
			})
		this.test();
		}
	},
   test: function(){
    var out=[];
    setInterval(function(){
      if(!this.state.miss){
           this.setState({
           match: false,
           miss: false,
           alert: " "
      })
      }
      if(this.state.miss){
       if(this.state.score!==0){
          this.setState({
         score: this.state.score-5,
         miss: false,
         alert: "Missed a match"
       })
       }
        else{
         this.setState({
            miss: false,
            alert: "Missed a match"
          })
        }

     }
    //start with forced match command
    if(out.length===15){
      out.push(out[out.length-1])
      this.state.style[out[out.length-1]]=newStyle;
      this.setState({
        style: this.state.style,
        match: true,
        miss: true
      })
      setTimeout(function(){
        this.state.style[out[out.length-1]]=standardStyle;
        this.setState({
        style: this.state.style
      })
        out=[]
    }.bind(this),500);
  }
  else{
    out.push(parseInt(Math.random()*9));
    this.state.style[out[out.length-1]]=newStyle;
    this.setState({
      style: this.state.style
    })
    //pause for thinking/processing time
  if(out.length>1){
      if(out[out.length-1]===out[out.length-2]){
        setTimeout(function(){
        this.state.style[out[out.length-1]]=standardStyle;
        this.setState({
          style: this.state.style,
          match: true,
          miss: true
         })
        out=[];
      }.bind(this),500)
      }
      else{
        setTimeout(function(){
        this.state.style[out[out.length-1]]=standardStyle;
        this.setState({
          style: this.state.style
        })
        }.bind(this),500);
      }
    };
    if(out.length===1){
      setTimeout(function(){
        this.state.style[out[out.length-1]]=standardStyle;
        this.setState({
          style: this.state.style
        })
        }.bind(this),500);
    }
  }
}.bind(this),2000)
  },
match: function(){
  if(this.state.match){
    this.setState({
      score: this.state.score+10,
      miss: false,
      alert: "Good job"
    })
  }
  else{
    if(this.state.score!==0){
      this.setState({
      score: this.state.score-5,
      alert: "Not a match"
    })
    }
    else{
      this.setState({
      alert: "Not a match"
    })
    }
  }
},
  render: function() {
   	var overlay = this.state.overlay ? (
      <div className="overlay">
        <center>
          <a className="btn" href="#">{this.state.initialTimer}</a>
        </center>
      </div>
    ) : '';

    return (
      <div className="gameContainer">
      	{overlay}
      	<div className="gameHeading">
      		<div className="gameScore"><b>Score: {this.state.score}</b></div>
      		<GameTimer></GameTimer>
      	</div>

        <div className="gameRow">
          <div className="gameSquare" style={this.state.style[0]}></div>
          <div className="gameSquare" style={this.state.style[1]}></div>
          <div className="gameSquare" style={this.state.style[2]}></div>
        </div>
        <div className="gameRow">
          <div className="gameSquare" style={this.state.style[3]}></div>
          <div className="gameSquare" style={this.state.style[4]}></div>
          <div className="gameSquare" style={this.state.style[5]}></div>
        </div>
        <div className="gameRow">
          <div className="gameSquare" style={this.state.style[6]}></div>
          <div className="gameSquare" style={this.state.style[7]}></div>
          <div className="gameSquare" style={this.state.style[8]}></div>
        </div>
        <div className="scoreAlert">
          {this.state.alert}
        </div>

        <div className="gameButtonsContainer">
			<a>SOUND</a>
			<a>BOTH</a>
			<a onClick={this.match}>POSITION</a>
		</div>
      </div>
    );
  }
});

///Taylor: style sheets for changing colors on timer
var standardStyle={
  backgroundColor: "#BFBFBF"
}

var newStyle={
  backgroundColor: 'blue'
}


// ReactDOM.render(<Game />, document.getElementById('root'));

ReactDOM.render(
  <Mainmenu/>, document.getElementById('root'));
