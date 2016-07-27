var React = require('react');
import {Link} from 'react-router'

var SilentStartOverlay = React.createClass({
	render: function() {
		return (
			<div className="overlay">
	          <div className="overlayContent">
	          <h2 className="silent">Silent Mode</h2>
	          <h3 className="silent">(position &amp; color)</h3>
	            <p className="silent">Use the left and right arrow keys or press the corresponding buttons to select a match. 
	            If there is a position and color match at the same time, select both options simultaneously.</p>
	            <div className="key-wrapper">
	              <ul className="row">
	                <li className="key keySilent k38">↑</li>
	              </ul>

	              <ul className="row">
	                <li className="key keySilent k37">←</li>
	                <li className="key keyBlank k40">↓</li>
	                <li className="key keySilent k39">→</li>
	              </ul>
	            </div>
	            <Link to="/tutorial"><h3 className="silent tutorialBtn tutorialBtnSilent">Full Tutorial</h3></Link>
	            <a onClick={this.props.click} className="gameStartBtn silentStartBtn">
	            	Start Game
	            </a>
	            <Link to="/home"><h3 className="silent">&larr; Go Back</h3></Link>
	          </div>
	        </div>
		)
	}
});

var ClassicStartOverlay = React.createClass({
	render: function() {
		return (
			<div className="overlay">
	          <div className="overlayContent">
	          <h2 className="classic">Classic Mode</h2>
	          <h3 className="classic">(position &amp; sound)</h3>
	            <p className="classic">Use the left and right arrow keys or press the corresponding buttons to select a match. 
	            If there is a position and sound match at the same time, select both options simultaneously.</p>
	            <div className="key-wrapper">
	              <ul className="row">
	                <li className="key keyClassic k38">↑</li>
	              </ul>

	              <ul className="row">
	                <li className="key keyClassic k37">←</li>
	                <li className="key k40 keyBlank"></li>
	                <li className="key keyClassic k39">→</li>
	              </ul>
	            </div>
	            <Link to="/tutorial"><h3 className="classic tutorialBtn tutorialBtnClassic">Full Tutorial</h3></Link>
	            <a onClick={this.props.click} className="gameStartBtn classicStartBtn">
	            	Start Game
	            </a>
	            <Link to="/home"><h3 className="classic">&larr; Go Back</h3></Link>
	          </div>
	        </div>
		)
	}
});

var RelaxedStartOverlay = React.createClass({
	render: function() {
		return (
			<div className="overlay">
	          <div className="overlayContent">
	          <h2 className="relaxed">Relaxed Mode</h2>
	          <h3 className="relaxed">(position &amp; sound)</h3>
	            <p className="relaxed">Use the up arrow key or press the corresponding button to select a position match.</p>
	            <div className="key-wrapper">
	              <ul className="row">
	                <li className="key k38 relaxed keyRelaxed">↑</li>
	              </ul>

	              <ul className="row">
	                <li className="key keyBlank k37">←</li>
	                <li className="key keyBlank k40">↓</li>
	                <li className="key keyBlank k39">→</li>
	              </ul>
	            </div>
	            <Link to="/tutorial"><h3 className="relaxed tutorialBtn tutorialBtnRelaxed">Full Tutorial</h3></Link>
	            <a onClick={this.props.click} className="gameStartBtn relaxedStartBtn">
	            	Start Game
	            </a>
	            <Link to="/home"><h3 className="relaxed">&larr; Go Back</h3></Link>
	          </div>
	        </div>
		)
	}
});

var AdvancedStartOverlay = React.createClass({
	render: function() {
		return (
			<div className="overlay">
	          <div className="overlayContent">
	          <h2 className="advanced">Advanced Mode</h2>
	          <h3 className="advanced">(position &amp; sound)</h3>
	            <p className="advanced">Use the left, right and up arrow keys or press the corresponding buttons to select a match. 
	            If there is a match of two (or all three) of the stimuli at the same time, select two or three options simultaneously.</p>
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
	            <Link to="/tutorial"><h3 className="advanced tutorialBtn tutorialBtnAdvanced">Full Tutorial</h3></Link>
	            <a onClick={this.props.click} className="gameStartBtn advancedStartBtn">
	            	Start Game
	            </a>
	            <Link to="/home"><h3 className="advanced">&larr; Go Back</h3></Link>
	          </div>
	        </div>
		)
	}
});



module.exports = {
	SilentStartOverlay: SilentStartOverlay,
	ClassicStartOverlay: ClassicStartOverlay,
	RelaxedStartOverlay: RelaxedStartOverlay,
	AdvancedStartOverlay: AdvancedStartOverlay
}