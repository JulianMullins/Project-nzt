var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'

var Tutorial = React.createClass({
	render: function() {
		return (
      <div className="tutorial">
      <div className="key-wrapper">
        <div className="rules">Click <span>here</span> to test your keys.</div>
        <ul className="row">
          <li className="key k38">↑</li>
        </ul>

        <ul className="row">
          <li className="key k37">←</li>
          <li className="key k40">↓</li>
          <li className="key k39">→</li>
        </ul>
        <div className="rules2">Once pressed, you cannot undo it. For a double match, you need to press both keys.</div>
        <div className="rulemode">
        <div className="rules2">For Relaxed mode, there is only one button: Position. This will be your ↑ key.</div>
          <ul className="row">
            <li className="key k38">↑</li>
          </ul>
          <div className="rules2">For Classic mode, there are two buttons: Position and Sound. This will be your ← and → keys.</div>
            <ul className="row">
              <li className="key k37">←</li>
              <li className="key k40">↓</li>
              <li className="key k39">→</li>
            </ul>
            <div className="rules2">For Silent mode, there are two buttons: Position and Color. This will be your ← and → keys.</div>
              <ul className="row">
                <li className="key k37">←</li>
                <li className="key k40">↓</li>
                <li className="key k39">→</li>
              </ul>
              <div className="rules2">For Advanced mode, there are three buttons: Position and Color.</div>
                <ul className="row">
                  <li className="key k38">↑</li>
                </ul>

                <ul className="row">
                  <li className="key k37">←</li>
                  <li className="key k40">↓</li>
                  <li className="key k39">→</li>
                </ul>
          </div>
      </div>
    </div>
    )
	}
});

module.exports = Tutorial;
