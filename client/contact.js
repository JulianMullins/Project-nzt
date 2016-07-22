var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'

var Contact = React.createClass({
	render: function() {
		return (
			<div className="cPage">
				<div className="contactPage">
					<h1 className="cHeader">Contact Us</h1>
					<h3 className="cHeader">We'd love to hear from you.</h3>
					<div className="contactlines">
						<li><Link to="https://github.com/JulianMullins/Project-nzt">Github</Link></li>
						<li><a href="https://virginia61.typeform.com/to/xK1GK6" target="_blank">Feedback Form</a></li>
				</div>
			</div>
			<div className="contactPage2">
				<h1 className="cHeader">About</h1>
				<pl>We're a team of college students from Horizons School of Technology who came together to create beautifully designed products that puts people's needs first. Cortex is the brain child of four people who want to improve the memories of people in a fun and easy way. Check out our work on Github and other projects!</pl>
				</div>
		</div>

		)
	}
});

module.exports = Contact;
