var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'


var NavBar = React.createClass({
	logInOut: function(){

		fetch('/logout', {
			method: 'get'
		})

	},

	render: function(){
		
		return(
			<div>
				<nav id="bt-menu" className="bt-menu">
					<a href="" className="bt-menu-trigger"><span>Menu</span></a>
					<ul>
						<li><Link to="/">Home</Link></li>
						<li><Link to="/login">Login</Link></li>
						<li><Link to="/leaderboard">Leaderboard</Link></li>
						<li><Link to="/stats">Stats</Link></li>
						<li><Link to="/science">The Science</Link></li>
						<li><Link to="/contact">Contact</Link></li>
					</ul>
					<ul>
						<li><Link to="/settings"><i className="fa fa-cog"  aria-hidden="true"></i></Link></li>
					</ul>
				</nav>
				
			</div>
		)
	}
});


module.exports = NavBar;