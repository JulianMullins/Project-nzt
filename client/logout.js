var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');
import { Link } from 'react-router';

var Logout = React.createClass({
	getInitialState(){
		return{
			goHome:false
		}
	},
	componentDidMount(){
		console.log("gonna logout")
		axios({
	      url: '/logout',
	      withCredentials: true
	    }).then(function(response){
	    	if(response.data.success){
	    		this.props.history.push('/home')
	    	}
	    }.bind(this))
	    this.props.history.push('/home');
	},
	render(){
		return null;
	}
})

module.exports = Logout;