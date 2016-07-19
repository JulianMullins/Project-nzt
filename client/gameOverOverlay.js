var React = require('react');
var ReactDOM = require('react-dom');


var gameOver = function(score){
  fetch('/gameOver', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        score: score
      })
    })
}

var GameOverOverlay = React.createClass({
  getInitialState:function(){
    return{
      username:null
    }
  },
  update:function(){
    this.setState({
      username: "nn"
    })
  },
  gameOver: function(score){

    fetch('/gameOver', {
        method: 'post',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          score: this.props.score,
          inputUsername:this.state.username
        })
      })
  },
  render: function() {
    return (
      <div className="overlay" id="gameover">
        <center>
          <form>
            <h1>Game Over</h1>
            <input type="text" placeholder="username" name="username" id="username"></input>
            <br></br>
            <button>Submit</button>
            <br></br>
            <button>Sign In</button>
          </form>
        </center>
      </div>
    )
  }
});


module.exports = GameOverOverlay