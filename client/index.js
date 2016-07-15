var React = require('react');
var ReactDOM = require('react-dom');

var MenuOverlay = React.createClass({
  render: function() {
    return (
      <div className="overlay">
        <center>
          <a className="btn" href="#" onClick={this.props.start}>Start</a>
          <a className="btn" href="#" onClick={this.props.login}>Login</a>
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
            <input type="text" placeholder="username"></input>
            <br></br>
            <input type="password" placeholder="password"></input>
            <br></br>
            <button onClick={this.props.login}>Login</button>
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
  start: function() {
    this.setState({menu: false, login: false});
  },
  login: function() {
    this.setState({menu: false, login: true})
  },
  back: function() {
    this.setState({menu: true, login: false})
  },
  normalMode: function() {
    this.setState({
      mode: {
        position: true,
        sound: true,
        color: false
      }
    }, this.goToGame);
  },
  posOnly: function() {
    this.setState({
      mode: {
        position: true,
        sound: false,
        color: false
      }
    }, this.goToGame);
  },
  posAndColor: function() {
    this.setState({
      mode: {
        position: true,
        sound: false,
        color: true
      }
    }, this.goToGame);
  },
  advanced: function() {
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
      ? <MenuOverlay start={this.start} login={this.login}></MenuOverlay>
      : '';
    var login = this.state.login
      ? <LoginOverlay login={this.start} back={this.back}></LoginOverlay>
      : '';
    return (
      <div>
        {menu}
        {login}
        <center>
          <h1 id="title">Project NZT</h1>
        </center>
        <div className="menu">
          <a href="#" className="menu-panel" onClick={this.normalMode}>
            <h2>normal</h2>
            <h3>(position, sound)</h3>
          </a>
          <a href="#" className="menu-panel" onClick={this.posOnly}>
            <h2>position-only</h2>
          </a>
        </div>
        <div className="menu">
          <a href="#" className="menu-panel" onClick={this.posAndColor}>
            <h2>position & color</h2>
          </a>
          <a href="#" className="menu-panel" onClick={this.advanced}>
            <h2>advanced</h2>
            <h3>(color, position, sound)</h3>
          </a>
        </div>
      </div>
    );
  }
});


var Game = React.createClass({
  getInitialState: function() {
    return {
     style: [standardStyle,standardStyle,standardStyle,standardStyle,standardStyle,standardStyle,standardStyle,standardStyle,standardStyle],
     match: false,
     score: 0,
     miss: false,
     alert: " "
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
    return (
      <div className="gameContainer">
        <div className="gameRow">
          <div id="square1" className="gameSquare" style={this.state.style[0]}></div>
          <div id="square2" className="gameSquare" style={this.state.style[1]}></div>
          <div id="square3" className="gameSquare" style={this.state.style[2]}></div>
        </div>
        <div className="gameRow">
          <div id="square4" className="gameSquare" style={this.state.style[3]}></div>
          <div id="square5" className="gameSquare" style={this.state.style[4]}></div>
          <div id="square6" className="gameSquare" style={this.state.style[5]}></div>
        </div>
        <div className="gameRow">
          <div id="square7" className="gameSquare" style={this.state.style[6]}></div>
          <div id="square8" className="gameSquare" style={this.state.style[7]}></div>
          <div id="square9" className="gameSquare" style={this.state.style[8]}></div>
        </div>
        <div><b>Score: {this.state.score}</b>   {this.state.alert}</div>
        <button onClick={this.test}>Start</button>
        <button onClick={this.match}>Match</button>
      </div>
    );
  }
});

///Taylor: style sheets for changing colors on timer
var standardStyle={
  backgroundColor: 'yellow'
}

var newStyle={
  backgroundColor: 'blue'
}


ReactDOM.render(<Game />, document.getElementById('root'));

// ReactDOM.render(
//   <Mainmenu/>, document.getElementById('root'));
