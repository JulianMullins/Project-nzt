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
			isUser:false
			// isloggedIn: this.props.isloggedin,
			// loginFunction: this.props.loginFunction,
			// isUser: this.props.isUser
		}
	},
	componentDidMount: function(){
	    // var loggedIn = updateLoggedIn(function(isUser){
	    // 	this.setState({loggedIn:isUser})
	    // }.bind(this))

		axios.get('/api/isUser')
	      .then(function(response){
	        this.setState({
	          isUser: response.data.isUser,
	          isloggedIn: response.data.isloggedin
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
						<li className="fbConnect"><Link to="/"><i className="fa fa-facebook"  aria-hidden="true"></i><span> CONNECT</span></Link></li>
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
