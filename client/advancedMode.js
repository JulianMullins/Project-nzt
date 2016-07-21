var React = require('react');
var GameTimer = require('./gameTimer');

var AdvancedMode = React.createClass({
  getInitialState: function() {
    return {
      style: [
        standardStyle,
        standardStyle,
        standardStyle,
        standardStyle,
        standardStyle,
        standardStyle,
        standardStyle,
        standardStyle,
        standardStyle
      ],
      colorMatch: false,
      positionMatch: false,
      soundMatch: false,
      score: 0,
      alert: " ",
      overlay: true,
      initialTimer: 3,
      N: 1,
      colorPressed: noStyle,
      soundPressed: noStyle,
      positionPressed: noStyle,
      //color, sound, popsistion
      correct: [false, false,false],
      mode: this.props.mode
    }
  },
  componentDidMount: function() {
    setInterval(this.timer, 1000);
    // fetch('/startGame/'+this.state.mode+'/'+this.state.N, {
    //  method: 'post'
    // });
    <script>
          {window.onkeyup = function(e) {
            if (e.keyCode == 37) {
              this.soundMatch();
            }
            if (e.keyCode == 38) {
              this.positionMatch();
            }
            if (e.keyCode == 39) {
              this.colorMatch();
            }
          }.bind(this)}</script>
  },
  timer: function() {
    this.setState({
      initialTimer: this.state.initialTimer - 1
    });
    if (this.state.initialTimer === 0) {
      this.setState({overlay: false});
      this.playGame();
    }
  },
  playGame: function() {
    var positionQueue = [];
    var colorQueue = [];
    var soundQueue = [];
    var timeTilPositionMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
    var timeTilColorMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
    var timeTilSoundMatch = parseInt((Math.random() * 5) + 2 + this.state.N);
     var timeKeeper = 0;
      //console.log(timekeeper)

    var iterations = setInterval(function() {
       timeKeeper++;

      if(!this.state.correct[0] && !this.state.correct[1] && !this.state.correct[2]){
        if(!this.state.colorMatch && !this.state.positionMatch && !this.state.soundMatch){
          //console.log('no matches')
          this.setState({
            soundPressed: noStyle, colorPressed: noStyle, positionPressed: noStyle, 
            colorMatch: false, soundMatch: false, positionMatch: false,
            correct: [false,false,false]
          })
        }
        else{
          this.setState({
            soundPressed: noStyle, colorPressed: noStyle, positionPressed: noStyle, 
            colorMatch: false, soundMatch: false, positionMatch: false,
            correct: [false,false,false],
            alert: "Missed a match"
          })
          if (this.state.score !== 0) {
          this.setState({
            score: this.state.score - 5
          });
        }
        }
      }
      else if(this.state.correct[0]===this.state.colorMatch && this.state.correct[1]===this.state.soundMatch && this.state.correct[2]===this.state.positionMatch){
        console.log('correct')
        this.setState({ 
            soundPressed: noStyle, colorPressed: noStyle, positionPressed: noStyle, 
            colorMatch: false, soundMatch: false, positionMatch: false,
            correct: [false,false,false],
            alert: "Good job!",
            score: this.state.score + 10
          })
      }
      else{
        console.log('incorrect')
        this.setState({
            soundPressed: noStyle, colorPressed: noStyle, positionPressed: noStyle,
            colorMatch: false, soundMatch: false, positionMatch: false, 
            correct: [false,false,false]
          })
         if (this.state.score !== 0) {
          this.setState({
            score: this.state.score - 5
          });
        }
      }

      this.setState({ colorPressed: noStyle, soundPressed: noStyle, positionPressed: noStyle, alert: " "});

      //NOT GOING TO ACTUALLY LIGHT UP COLORS UNTIL ALL IF STATEMENTS HAVE ITERATED
      //case 1: position match
      if (timeTilPositionMatch === 0) {
        //console.log('position match')
        this.setState({positionMatch: true, miss: true})
        //reset position portion
        timeTilPositionMatch = parseInt((Math.random() * 5) + 2);
        //set up new position queue
        var nextPosition = positionQueue[0];
        positionQueue.push(nextPosition);
        positionQueue.splice(0, 1);
        var pMatch = true;
      }
      //case 2: color match
      if (timeTilColorMatch === 0) {
        //console.log('color match')
        this.setState({colorMatch: true, miss: true})
        //reset position portion
        timeTilColorMatch = parseInt((Math.random() * 5) + 2);
        //set up new position queue
        var nextColor = colorQueue[0];
        colorQueue.push(nextColor);
        colorQueue.splice(0, 1);
        var cMatch = true;
      }
      //case 3: sound match
      if (timeTilSoundMatch === 0) {
       // console.log('sound match')
        this.setState({soundMatch: true, miss: true})
        //reset position portion
        timeTilSoundMatch = parseInt((Math.random() * 5) + 2);
        //set up new position queue
        var nextSound = soundQueue[0];
        soundQueue.push(nextSound);
        soundQueue.splice(0, 1);
        var sMatch = true;
      }
      // pick a non-matching next number while interval is not 0
      //position:
      if (!pMatch) {
        var nextPosition = parseInt(Math.random() * 9);
        while (nextPosition == positionQueue[0]) {
          nextPosition = parseInt(Math.random() * 9);
        }
        // resize array to N: color
        positionQueue.push(nextPosition);
        if (positionQueue.length > this.state.N) {
          positionQueue.splice(0, 1);
        }
      }
      //color:
      if (!cMatch) {
        var nextColor = parseInt(Math.random() * 9);
        while (nextColor == colorQueue[0]) {
          nextColor = parseInt(Math.random() * 9);
        }
        // resize array to N: color
        colorQueue.push(nextColor);
        if (colorQueue.length > this.state.N) {
          colorQueue.splice(0, 1);
        }
      }
      //sound:
      if (!sMatch) {
        var nextSound = parseInt(Math.random() * 9);
        while (nextSound == soundQueue[0]) {
          nextSound = parseInt(Math.random() * 9);
        }
        // resize array to N: color
        soundQueue.push(nextSound);
        if (soundQueue.length > this.state.N) {
          soundQueue.splice(0, 1);
        }
      }

      this.state.style[nextPosition] = newStyle[nextColor];
      var audio = new Audio('./audio/' + (nextSound + 1) + '.wav');
      audio.play();
      this.setState({style: this.state.style});
      setTimeout(function() {
        this.state.style[nextPosition] = standardStyle;
        this.setState({style: this.state.style});
        timeTilPositionMatch--;
        timeTilSoundMatch--;
        timeTilColorMatch--;
        sMatch = false;
        cMatch = false;
        pMatch = false;
      }.bind(this), 800);
      if (timeKeeper === 60) {
        console.log('over')
        clearInterval(iterations);
      }
    }.bind(this), 2000);
  },
  colorMatch: function() {
      this.state.correct[0]=true;
      this.setState({
        colorPressed: pushStyle,
        correct: this.state.correct
      });    
  },
  positionMatch: function() {
      this.state.correct[2]=true;
      this.setState({
        positionPressed: pushStyle,
        correct: this.state.correct
      });
  },
  soundMatch: function() {
      this.state.correct[1]=true;
      this.setState({
        soundPressed: pushStyle,
        correct: this.state.correct
      });
  },
  handleKeyPress: function(event){
    console.log('clicky')
      if(event.key == 'Enter'){
    console.log('enter press here! ')
  }
},
  render: function() {
    var overlay = this.state.overlay
      ? (
        <div className="overlay">
          <center>
            <a className="btn">{this.state.initialTimer}</a>
          </center>
        </div>
      )
      : '';

    var scoreAlert;
    if (this.state.alert === "Good job") {
      scoreAlert = <div className="scoreAlertPositive">
                    {this.state.alert}
                   </div>
    } else if (this.state.alert === "Not a match" ||
               this.state.alert === "Missed a match") {
      scoreAlert = <div className="scoreAlertNegative">
                    {this.state.alert}
                   </div>
    } else {
      scoreAlert = <div></div>
    }

    // window.onkeyup= function(e){
    //   if(e.which===37){
    //     {this.soundMatch}
    //     console.log('37')
    //   }
    //   if(e.which===38){
    //     {this.positionMatch}
    //     console.log('38')
    //   }
    //   if(e.which===39){
    //     {this.soundMatch}
    //     console.log('39')
    //   }
    // }
    return (
      <div className="gameContainer advancedContainer">
        {overlay}
        <h1 className="advancedScore">Advanced</h1>
        <div className="gameHeading">
          <div className="gameScore">
            <h2 className="advancedScore">Score: {this.state.score}</h2>
          </div>
          <GameTimer timeStyle={{
            'color': "#F1BA03"
          }}></GameTimer>
        </div>
        <div className="gameBoard">
          <div className="gameSquare" style={this.state.style[0]}></div>
          <div className="gameSquare" style={this.state.style[1]}></div>
          <div className="gameSquare" style={this.state.style[2]}></div>
          <div className="gameSquare" style={this.state.style[3]}></div>
          <div className="gameSquare" style={this.state.style[4]}></div>
          <div className="gameSquare" style={this.state.style[5]}></div>
          <div className="gameSquare" style={this.state.style[6]}></div>
          <div className="gameSquare" style={this.state.style[7]}></div>
          <div className="gameSquare" style={this.state.style[8]}></div>
        </div>
        <div className="scoreAlert">
          {scoreAlert}
        </div>
        <div className="gameButtonsContainer advancedMode" onKeyPress={this.handleKeyPres}>
          <a style={this.state.soundPressed} >SOUND</a>
          <a style={this.state.positionPressed}>POSITION</a>
          <a style={this.state.colorPressed}>COLOR</a>
        </div>
      </div>
    );
  }
});

var noStyle={}
var pushStyle={color: 'black'}

var standardStyle = {
  backgroundColor: "#BFBFBF"
}

var newStyle = [
  {
    backgroundColor: '#DBFF33'
  }, {
    backgroundColor: '#B15CCB'
  }, {
    backgroundColor: '#5CCBAF'
  }, {
    backgroundColor: '#5CCD93'
  }, {
    backgroundColor: '#87CD5C'
  }, {
    backgroundColor: '#D3A43F'
  }, {
    backgroundColor: '#D3563F'
  }, {
    backgroundColor: '#3F49D3'
  }, {
    backgroundColor: '#C91A83'
  }
]

module.exports = AdvancedMode