var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');
import { Link } from 'react-router';

var Logout = React.createClass({
	getInitialState(){
		//console.log("doing logout")
		return{
			goHome:false
		}
	},
	componentDidMount(){
		//console.log("gonna logout")
		axios.post('/api/logout',{
	      withCredentials: true
	    }).then(function(response){
	    	//console.log(response.data)
	    	if(response.data.success){
	    		this.props.history.push('/login')
	    	}
	    	else{
	    		this.props.history.push('/login/logoutFailure')
	    	}
	    }.bind(this))
	    // this.props.history.push('/home');
	},
	render(){
		return null;
	}
})

module.exports = Logout;