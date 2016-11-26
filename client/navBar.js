var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router';
var axios = require('axios');


var updateLoggedIn = function(callback){
    axios({
      url: 'api/isUser',
      withCredentials: true
    }).then(function(response){
      callback(response.data.isUser,response.data.isloggedin);

    })
}

var NavBar = React.createClass({
	getInitialState: function(){
		//console.log(this)
		return {
			open: false,
			isloggedIn:false,
			isUser:false,
			isFBuser:false

		}
	},
	componentDidMount: function(){
	    // var loggedIn = updateLoggedIn(function(isUser){
	    // 	this.setState({loggedIn:isUser})
	    // }.bind(this))

		axios.get('/api/isUser')
	      .then(function(response){
	      	// console.log(response.data);
	        this.setState({
	          isUser: response.data.isUser,
	          isloggedIn: response.data.isloggedin,
	          isFBuser:response.data.isFBuser
	        })
	        //console.log(this.state);
	      }.bind(this))

	    //console.log(this.state)
	},
	click: function(e){
		e.preventDefault();
		var loggedIn = updateLoggedIn(function(isUser,isloggedin){
	    	this.setState({
	    		isloggedIn:isloggedin, 
	    		isUser:isUser
	    	})
	    }.bind(this))
		this.setState({
			open: !this.state.open
		});
	},
	close: function(e) {
		var loggedIn = updateLoggedIn(function(isUser,isloggedin){
	    	this.setState({
	    		isloggedIn:isloggedin, 
	    		isUser:isUser
	    	})
	    }.bind(this))
		this.setState({
			open: false
		});
		//console.log("navbar state changed--close")

	},
	closeLogInOut(e){
		this.setState({
			open:false
		})
		
		// var loggedIn = updateLoggedIn(function(isUser,isloggedin){
	 //    	this.setState({isloggedIn:isloggedin, isUser:isUser})
	 //    }.bind(this))

		// axios({
	 //      url: '/isUser',
	 //      withCredentials: true
	 //    }).then(function(response){
	 //      if(response.data.isUser!=this.state.loggedIn){
	 //        this.setState({
	 //        	loggedIn:response.data.isUser
	 //        })
	 //      }
	 //    }.bind(this))

	},
	render: function(){
		var logInOutLink = this.state.isUser
			? '/logout'
			: '/login'
		var logInOrOut = this.state.isUser
			? 'Logout'
			: 'Login';
		return(
			<div>
				<nav id="bt-menu" className={
					this.state.open
						? 'bt-menu bt-menu-open'
						: 'bt-menu bt-menu-close'
				}>
					<a className="bt-menu-trigger" onClick={this.click}><span>Menu</span></a>
					<ul style={this.state.open ? {pointerEvents: 'auto'} : {pointerEvents: 'none'}}>
						<li><Link to="/home" onClick={this.close}>Home</Link></li>
						<li><Link to={logInOutLink} onClick={this.close}>{logInOrOut}</Link></li>
						<li><Link to="/tutorial" onClick={this.close}>Tutorial</Link></li>
						<li><Link to="/leaderboard" onClick={this.close}>Leaderboard</Link></li>
						<li><Link to="/stats" onClick={this.close}>Stats</Link></li>
						<li><Link to="/science" onClick={this.close}>The Science</Link></li>
						<li><Link to="/contact" onClick={this.close}>Contact</Link></li>
					</ul>
					<ul>
						{/*this.state.isFBuser
							? ''
							: <li className="fbConnect"><a href='/api/login/facebook'><i className="fa fa-facebook"  aria-hidden="true"></i><span> CONNECT</span></a></li>
						*/}
					</ul>
					<div className='bt-overlay' onClick={this.click}/>
				</nav>

			</div>
		)
	}
});

// second menu goes underneath </ul>
// <ul>
// 	<li><Link to="/settings"><i className="fa fa-cog"  aria-hidden="true"></i></Link></li>
// </ul>


module.exports = NavBar;
