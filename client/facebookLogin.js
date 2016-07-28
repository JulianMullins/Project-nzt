var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');
import { Link } from 'react-router';

var FacebookLogin = React.createClass({
	componentDidMount(){
		console.log("fb login")
		axios.get('/login/facebook')
		.then(function(response) {
	      if (response.data.success) {
	        this.props.history.push('/home');
	      }
	    }.bind(this))
	},
	render(){return null;}
})

module.exports = FacebookLogin;