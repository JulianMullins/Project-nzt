var React = require('react');
var ReactDOM = require('react-dom');




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
				<a href="#" className="bt-menu-trigger"><span>Menu</span></a>
				<ul>
					<li><a href="#" className="fa fa-book">Learn More</a></li>
					<li><a href="#" className="fa fa-cogs">Settings</a></li>
					<li><a href="#" className="fa fa-trophy">Stats</a></li>
					<li><a href="#" className="fa fa-info-circle">About</a></li>
					<li><a onClick={this.logInOut} className="fa fa-sign-in">Login</a></li>
				</ul>
				</nav>
				<script src="./js/classie.js"></script>
				<script src="./js/borderMenu.js"></script>
			</div>
		)
	}
});


module.exports = NavBar;