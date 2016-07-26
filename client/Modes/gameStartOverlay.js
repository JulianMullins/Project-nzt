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
	            If there is a position and color match at the same time, select both options.</p>
	            <div className="key-wrapper">
	              <ul className="row">
	                <li className="key k38">↑</li>
	              </ul>

	              <ul className="row">
	                <li className="key k37">←</li>
	                <li className="key k40">↓</li>
	                <li className="key k39">→</li>
	              </ul>
	            </div>
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
	                <li className="key k38">↑</li>
	              </ul>

	              <ul className="row">
	                <li className="key k37">←</li>
	                <li className="key k40">↓</li>
	                <li className="key k39">→</li>
	              </ul>
	            </div>
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
	                <li className="key k38">↑</li>
	              </ul>

	              <ul className="row">
	                <li className="key k37">←</li>
	                <li className="key k40">↓</li>
	                <li className="key k39">→</li>
	              </ul>
	            </div>
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
	                <li className="key k38">↑</li>
	              </ul>

	              <ul className="row">
	                <li className="key k37">←</li>
	                <li className="key k40">↓</li>
	                <li className="key k39">→</li>
	              </ul>
	            </div>
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