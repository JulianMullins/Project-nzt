var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router';

var FacebookLogin = React.createClass({
	componentDidMount(){
		console.log("fb login")
		fetch('/login/facebook',{method:'get'
		}).then(function(response) {
	      return response.json();
	    }).then(function(response) {
	      if (response.success) {
	        this.props.history.push('/home');
	      }
	    }.bind(this))
	},
	render(){return null;}
})

module.exports = FacebookLogin;