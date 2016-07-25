var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'

var Tutorial = React.createClass({

componentDidMount: function(){
	$(document).ready(function() {
	$(window).keydown(function(e) {
		var key = (e.keyCode) ? e.keyCode : e.which;
		$('.key.k' + key).addClass('active');
		console.log(key);
	});

	$(window).keyup(function(e) {
		var key = (e.keyCode) ? e.keyCode : e.which;
		$('.key.k' + key).removeClass('active');
	});
	})
},
	render: function() {
		return (
      <div className="tutorial">
      <div className="key-wrapper">
        <h4>Click <spanl>here</spanl> to test your keys.</h4>
        <ul className="row">
          <li className="key k38">↑</li>
        </ul>

        <ul className="row">
          <li className="key k37">←</li>
          <li className="key k40">↓</li>
          <li className="key k39">→</li>
        </ul>
        <h4>Once pressed, you cannot undo it. For a double match, you need to press both keys.</h4>
        <div className="rulemode">
					<div className="rules2">
        <h2>RELAXED</h2>
					<h4>There is only one button: Position. This will be your ↑ key.</h4>
          <ul className="row">
            <li className="key k37">POSITION</li>
          </ul>
					</div>
					<div className="rules2">
						<h2>CLASSIC</h2>
          <h4>There are two buttons: Position and Sound. This will be your ← and → keys.</h4>
            <ul className="row">
              <li className="key k37">POSITION</li>
              <li className="key k40">↓</li>
              <li className="key k39">SOUND</li>
            </ul>
					</div>
				</div>
				<div className="rulemode2">
            <div className="rules2">
							<h2>SILENT</h2>
							<h4>There are two buttons: Position and Color. This will be your ← and → keys.</h4>
              <ul className="row">
                <li className="key k37">POSITION</li>
                <li className="key k40">↓</li>
                <li className="key k39">COLOR</li>
              </ul>
						</div>
						<div className="rules2">
							<h2>ADVANCED</h2>
              <h4>There are three buttons: Position Sound, and Color.</h4>
                <ul className="row">
                  <li className="key k38">POSITION</li>
                </ul>
                <ul className="row">
                  <li className="key k37">SOUND</li>
                  <li className="key k40">↓</li>
                  <li className="key k39">COLOR</li>
                </ul>
						</div>
          </div>
      </div>
    </div>
    )
	}
});

module.exports = Tutorial;
