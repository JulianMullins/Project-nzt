var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router';

var Logout = React.createClass({
	componentDidMount(){
		console.log("gonna logout")
		fetch('/logout',{method:'get'
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

module.exports = Logout;