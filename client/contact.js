var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'

var Contact = React.createClass({
	render: function() {
		return (
			<div className="leaderboardPage">
				<div className="contactPage">
					<h1 className="cHeader">Contact Us</h1>
					<h2 className="cHeader">We'd love to hear from you.</h2>
					<div className="contactlines">
						<li><Link to="https://github.com/JulianMullins/Project-nzt">Github</Link></li>
						<li><a href="mailto:virginiavankeuren@gmail.com">Email</a></li>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = Contact;
