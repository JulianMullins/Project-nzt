var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'

var Contact = React.createClass({
	render: function() {
		return (
			<div className="contactPage">
				<div className="contactTop">
					<h1>Contact Us</h1>
					<p>We&#39;d love to hear from you</p>
					<a target="_blank" href="https://github.com/JulianMullins/Project-nzt">Github</a>
					<a target="_blank" href="https://cortexgame.typeform.com/to/xK1GK6" target="_blank">Feedback Form</a>
				</div>

				<div className="contactBottom">
					<h1>About Us</h1>
					<p>We&#39;re a team of college
					students from Horizons School of Technology who came together to create
					beautifully designed products that puts people&#39;s needs first. Cortex is the
					brain child of five people who want to improve the memories of people in a fun
					and easy way. Check out our work on Github and other projects!</p>
				</div>
			</div>
		)
	}
});

module.exports = Contact;

			// <div className="cPage">
			// 	<div className="contactPage3">
			// 		<h1 className="cHeader">Contact Us</h1>
			// 		<h3 className="cHeader">We&#39d love to hear from you.</h3>
			// 		<div className="contactlines">
						// <li><Link to="https://github.com/JulianMullins/Project-nzt">Github</Link></li>
						// <li><a href="https://cortexgame.typeform.com/to/xK1GK6" target="_blank">Feedback Form</a></li>
			// 		</div>
			// 	</div>

			// 	<div className="contactPage4">
			// 		<h1 className="cHeader">About</h1>
					// <p>We&#39re a team of college
					// students from Horizons School of Technology who came together to create
					// beautifully designed products that puts people&#39s needs first. Cortex is the
					// brain child of five people who want to improve the memories of people in a fun
					// and easy way. Check out our work on Github and other projects!</p>
			// 	</div>
			// </div>