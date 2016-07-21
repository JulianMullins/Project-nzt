var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'


var NavBar = React.createClass({
	getInitialState(){
		return {
			open: false,
			loggedIn: false
		}
	},
	componentDidMount(){
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
	click(e){
		e.preventDefault();
		this.setState({
			open: !this.state.open
		}, function() {
			if (this.state.open) {
				$("#root").css("margin", "0px 0px 50px 160px");
	      $("#root").css("transition-duration", ".4s");
			} else {
				$('#root').css('margin', '');
	      $("#root").css("transition-duration", ".2s");
			}
		}.bind(this));
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
						<li><Link to="/home">Home</Link></li>
						<li><Link to={logInOutLink}>{logInOrOut}</Link></li>
						<li><Link to="/leaderboard">Leaderboard</Link></li>
						<li><Link to="/stats">Stats</Link></li>
						<li><Link to="/science">The Science</Link></li>
						<li><Link to="/contact">Contact</Link></li>
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
