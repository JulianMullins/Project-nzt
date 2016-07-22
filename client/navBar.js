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
		}).then(function(response) {
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
					<ul>
						<li><Link to="/home" onClick={this.close}>Home</Link></li>
						<li><Link to={logInOutLink} onClick={this.close}>{logInOrOut}</Link></li>
						<li><Link to="/leaderboard" onClick={this.close}>Leaderboard</Link></li>
						<li><Link to="/stats" onClick={this.close}>Stats</Link></li>
						<li><Link to="/science" onClick={this.close}>The Science</Link></li>
						<li><Link to="/contact" onClick={this.close}>Contact</Link></li>
					</ul>
					<ul>
						<li><Link to="/settings"><i className="fa fa-cog"  aria-hidden="true"></i></Link></li>
					</ul>
					<div className='bt-overlay' onClick={this.click}/>
				</nav>

			</div>
		)
	}
});


module.exports = NavBar;
