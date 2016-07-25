var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'


var NavBar = React.createClass({
	getInitialState: function(){
		return {
			open: false,
			loggedIn: false
		}
	},
	componentDidMount: function(){
		fetch('/isLoggedIn',{method:'get'
		})
		.then(function(response) {
	      return response.json();
	    }).then(function(response) {
	      if (response.loggedIn) {
	        this.setState({
	        	loggedIn:true
	        })
	      }
	    }.bind(this))
	},
	click: function(e){
		e.preventDefault();
		this.setState({
			open: !this.state.open
		});
	},
	close: function(e) {
		this.setState({
			open: false
		});
		console.log("navbar state changed--close")

	},
	closeLogInOut(e){
		console.log(this.state);
		this.setState({
			open:false,
			loggedIn:!this.state.loggedIn
		})
		console.log("navbar state changed")
	},
	render: function(){
		var logInOutLink = this.state.loggedIn
			? '/logout'
			: '/login'
		var logInOrOut = this.state.loggedIn
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
						<li><Link to="/home"><a onClick={this.close}>Home</a></Link></li>
						<li><Link to={logInOutLink}><a onClick={this.closeLogInOut}>{logInOrOut}</a></Link></li>
						<li><Link to="/leaderboard"><a onClick={this.close}>Leaderboard</a></Link></li>
						<li><Link to="/stats"><a onClick={this.close}>Stats</a></Link></li>
						<li><Link to="/science"><a onClick={this.close}>The Science</a></Link></li>
						<li><Link to="/contact"><a onClick={this.close}>Contact</a></Link></li>
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
