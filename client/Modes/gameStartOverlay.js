var React = require('react');
var axios = require('axios');
var MediaQuery = require('react-responsive');
import {Link} from 'react-router'

var capFirstLetter = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var StartOverlay = React.createClass({
  getInitialState: function() {
    return {nLevel: this.props.nLevel}
  },
  render: function() {
    var modeProperties;
    var modeDescription;
    var keys;

    if (this.props.mode == 'classic') {
      modeProperties = '(position & sound)';
      modeDescription = 'position/sound';
      keys = (
        <MediaQuery minWidth='960px'>
          <div className="overlayKeysContainer">
            <p className="classic">Use the left and right arrow keys or press the corresponding buttons to select a match. If there is a position and sound match at the same time, select both options simultaneously.</p>
            <div className="key-wrapper">
              <ul className="row">
                <li className="key keyClassic k37">←</li>
                <li className="key k40 keyBlank"></li>
                <li className="key keyClassic k39">→</li>
              </ul>
            </div>
          </div>
        </MediaQuery>
      );
    } else if (this.props.mode == 'relaxed') {
      modeProperties = '(position)';
      modeDescription = 'position';
      keys = (
        <MediaQuery minWidth='960px'>
          <div className="overlayKeysContainer">
            <p>Use the up arrow key or press the corresponding button to select a position match.</p>
            <div className="key-wrapper">
              <ul className="row">
                <li className="key k38 relaxed keyRelaxed">↑</li>
              </ul>
            </div>
          </div>
        </MediaQuery>
      );
    } else if (this.props.mode == 'silent') {
      modeProperties = '(position & color)';
      modeDescription = 'position/color'
      keys = (
        <MediaQuery minWidth='960px'>
          <div className="overlayKeysContainer">
            <p className="silent">Use the left and right arrow keys or press the corresponding buttons to select a match. If there is a position and color match at the same time, select both options simultaneously.</p>
            <div className="key-wrapper">
              <ul className="row">
                <li className="key keySilent k37">←</li>
                <li className="key keyBlank k40">↓</li>
                <li className="key keySilent k39">→</li>
              </ul>
            </div>
          </div>
        </MediaQuery>
      );
    } else {
      modeProperties = '(position, color & sound)';
      modeDescription = 'position/color/sound';
      keys = (
        <MediaQuery minWidth='960px'>
          <div className="overlayKeysContainer">
            <p className="advanced">Use the left, right and up arrow keys or press the corresponding buttons to select a match. If there is a match of two (or all three) of the stimuli at the same time, select two or three options simultaneously.</p>
            <div className="key-wrapper">
              <ul className="row">
                <li className="key keyAdvanced k38">↑</li>
              </ul>
              <ul className="row">
                <li className="key keyAdvanced k37">←</li>
                <li className="key k40 keyBlank">↓</li>
                <li className="key keyAdvanced k39">→</li>
              </ul>
            </div>
          </div>
        </MediaQuery>
      );
    }

    return (
      <div className="overlay">
        <div className="overlayContent">
          <div className="overlayHeader">
            <h2 className={this.props.mode}>{capFirstLetter(this.props.mode)} Mode</h2>
            <h3 className={this.props.mode}>{modeProperties}</h3>
          </div>
          {keys}

          <div className="nLevelAlert">
            <div className="nLevelNum">
              <h1>{this.state.nLevel}</h1>
              <h3>N-LEVEL</h3>
            </div>
            <div className="nLevelText">
              <p>You are on n-level {this.state.nLevel}, therefore a match occurs when a {modeDescription} stimulus from {this.state.nLevel + " "}
                {!(this.state.nLevel - 1) ? 'move' : 'moves'} back matches the current {modeDescription}.</p>
              <Link to="/tutorial">
                <h3 className={this.props.mode + " tutorialBtn"}>Full Tutorial</h3>
              </Link>
            </div>
          </div>

          <div className="overlayFooter">
            <a onClick={this.props.click} className={"gameStartBtn " + this.props.mode + "StartBtn"}>
              Start Game
            </a>
            <Link to={"/levels/" + this.props.mode}>
              <h3 className={this.props.mode}>&larr; Go Back</h3>
            </Link>
          </div>

        </div>
      </div>
    )
  }
});

module.exports = StartOverlay;
