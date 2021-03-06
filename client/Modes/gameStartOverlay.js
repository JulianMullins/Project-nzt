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
    var modeLevelGif;

    var footerBtnMobile = (
      <MediaQuery maxWidth='767px'>
        <div className="overlayFooter">
          <Link to={"/levels/" + this.props.mode}>
            <h3 className={this.props.mode}>&larr; Go Back</h3>
          </Link>
          <a onClick={this.props.click} className={"gameStartBtn " + this.props.mode + "StartBtn"}>
            Start Game
          </a>
        </div>
      </MediaQuery>
    )

    var footerBtnDesktop = (
      <MediaQuery minWidth='768px'>
        <div className="overlayFooter">
          <a onClick={this.props.click} className={"gameStartBtn " + this.props.mode + "StartBtn"}>
            Start Game
          </a>
          <Link to={"/levels/" + this.props.mode}>
            <h3 className={this.props.mode}>&larr; Go Back</h3>
          </Link>
        </div>
      </MediaQuery>
    )

    if (this.props.mode == 'classic') {
      modeProperties = '(position & sound)';
      modeDescription = 'position/sound';
      keys = (
        <MediaQuery minWidth='768px'>
          <div className="keyInstructions">
              <div className="key-wrapper">
                <ul className="row">
                  <li className="keyGS keyClassic k38">↑</li>
                </ul>
                <ul className="row">
                  <li className="keyGS keyClassic k37">position</li>
                  <li className="keyGS k40 keyClassic">↓</li>
                  <li className="keyGS keyClassic k39">sound</li>
                </ul>
              </div>
            <p className="classic">Use the left and right arrow keys or press the corresponding buttons to select a match.</p>
          </div>
        </MediaQuery>
      );

      if(this.state.nLevel === 1) {
        modeLevelGif = (
          <img className="overlayGif" src="../../images/gameStartGifs/classic1.gif" alt="Gameplay Pattern"/>
        )
      }
      else if(this.state.nLevel === 2) {
        modeLevelGif = (
          <img className="overlayGif" src="../../images/gameStartGifs/classic2.gif" alt="Gameplay Pattern"/>
        )
      }
      else if(this.state.nLevel === 3) {
        modeLevelGif = (
          <img className="overlayGif" src="../../images/gameStartGifs/classic3.gif" alt="Gameplay Pattern"/>
        )
      }
    } else if (this.props.mode == 'relaxed') {
      modeProperties = '(position)';
      modeDescription = 'position';
      keys = (
        <MediaQuery minWidth='768px'>
          <div className="keyInstructions">
              <div className="key-wrapper">
                <ul className="row">
                  <li className="keyGS keyRelaxed k38">position</li>
                </ul>
                <ul className="row">
                  <li className="keyGS keyRelaxed k37">←</li>
                  <li className="keyGS k40 keyRelaxed">↓</li>
                  <li className="keyGS keyRelaxed k39">→</li>
                </ul>
              </div>
            <p className="relaxed">Use the up arrow key or press the corresponding button to select a position match.</p>
          </div>
        </MediaQuery>
      );

      if(this.state.nLevel === 1) {
        modeLevelGif = (
          <img className="overlayGif" src="../../images/gameStartGifs/relaxed1.gif" alt="Gameplay Pattern"/>
        )
      }
      else if(this.state.nLevel === 2) {
        modeLevelGif = (
          <img className="overlayGif" src="../../images/gameStartGifs/relaxed2.gif" alt="Gameplay Pattern"/>
        )
      }
      else if(this.state.nLevel === 3) {
        modeLevelGif = (
          <img className="overlayGif" src="../../images/gameStartGifs/relaxed3.gif" alt="Gameplay Pattern"/>
        )
      }
    } else if (this.props.mode == 'silent') {
      modeProperties = '(position & color)';
      modeDescription = 'position/color'
      keys = (
        <MediaQuery minWidth='768px'>
          <div className="keyInstructions">
              <div className="key-wrapper">
                <ul className="row">
                  <li className="keyGS keySilent k38">↑</li>
                </ul>
                <ul className="row">
                  <li className="keyGS keySilent k37">position</li>
                  <li className="keyGS k40 keySilent">↓</li>
                  <li className="keyGS keySilent k39">color</li>
                </ul>
              </div>
            <p className="silent">Use the left and right arrow keys or press the corresponding buttons to select a match.</p>
          </div>
        </MediaQuery>
      );
      if(this.state.nLevel === 1) {
        modeLevelGif = (
          <img className="overlayGif" src="../../images/gameStartGifs/silent1.gif" alt="Gameplay Pattern"/>
        )
      }
      else if(this.state.nLevel === 2) {
        modeLevelGif = (
          <img className="overlayGif" src="../../images/gameStartGifs/silent2.gif" alt="Gameplay Pattern"/>
        )
      }
      else if(this.state.nLevel === 3) {
        modeLevelGif = (
          <img className="overlayGif" src="../../images/gameStartGifs/silent3.gif" alt="Gameplay Pattern"/>
        )
      }
    } else {
      modeProperties = '(position, color & sound)';
      modeDescription = 'position/color/sound';
      keys = (
        <MediaQuery minWidth='768px'>
            <div className="keyInstructions">
              <div className="key-wrapper">
                <ul className="row">
                  <li className="keyGS keyAdvanced k38">position</li>
                </ul>
                <ul className="row">
                  <li className="keyGS keyAdvanced k37">sound</li>
                  <li className="keyGS k40 keyAdvanced">↓</li>
                  <li className="keyGS keyAdvanced k39">color</li>
                </ul>
              </div>
              <p className="advanced">Use the left, right and up arrow keys or press the corresponding buttons to select a match.</p>
            </div>
        </MediaQuery>
      );
      if(this.state.nLevel === 1) {
        modeLevelGif = (
          <img className="overlayGif" src="../../images/gameStartGifs/advanced1.gif" alt="Gameplay Pattern"/>
        )
      }
      else if(this.state.nLevel === 2) {
        modeLevelGif = (
          <img className="overlayGif" src="../../images/gameStartGifs/advanced2.gif" alt="Gameplay Pattern"/>
        )
      }
      else if(this.state.nLevel === 3) {
        modeLevelGif = (
          <img className="overlayGif" src="../../images/gameStartGifs/advanced3.gif" alt="Gameplay Pattern"/>
        )
      }
    }

    return (
      <div className="overlay">
        <div className="overlayContent">
          <div className="overlayHeader">
            <h2 className={this.props.mode}>{capFirstLetter(this.props.mode)} Mode</h2>
            <h3 className={this.props.mode}>{modeProperties}</h3>
          </div>
          <div className="overlayKeysContainer">
            {modeLevelGif}
            {keys}
          </div>

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

          {footerBtnMobile}
          {footerBtnDesktop}

        </div>
      </div>
    )
  }
});

module.exports = StartOverlay;
