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
				<nav id="bt-menu" class="bt-menu">
					<a href="#" class="bt-menu-trigger"><span>Menu</span></a>
					<ul>
						<li><Link to="/">Home</Link></li>
						<li><Link to="/login">Login</Link></li>
						<li><Link to="/leaderboard">Leaderboard</Link></li>
						<li><Link to="/stats">Stats</Link></li>
						<li><Link to="/science">The Science</Link></li>
						<li><Link to="/contact">Contact</Link></li>
					</ul>
					<ul>
						<li><Link to="/settings"><i class="fa fa-cog" style="font-size:55px; padding-top:10px" aria-hidden="true"></i></Link></li>
					</ul>
				</nav>
			</div>
		)
	}
});


module.exports = NavBar;