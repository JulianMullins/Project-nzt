var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'


var NavBar = React.createClass({
	getInitialState(){
		return {
			open:false,
		}
	},
	logInOut: function(){

		fetch('/logout', {
			method: 'get'
		})

	},
	click(e){
		this.setState({
			open: !this.state.open
		})
	},
	render: function(){
		
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
						<li><Link to="/login">Login</Link></li>
						<li><Link to="/leaderboard">Leaderboard</Link></li>
						<li><Link to="/stats">Stats</Link></li>
						<li><Link to="/science">The Science</Link></li>
						<li><Link to="/contact">Contact</Link></li>
					</ul>
					<ul>
						<li><Link to="/settings"><i className="fa fa-cog"  aria-hidden="true"></i></Link></li>
					</ul>
					<div className='bt-overlay' />
				</nav>
			
			</div>
		)
	}
});


module.exports = NavBar;