var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'

var Contact = React.createClass({
	render: function() {
		return (
			<div className="contactPage">
				<div className="contactTop">
					<div className="contactTopHeading">
						<h1>About Us</h1>
						<p>We are a team of college
						students from the Horizons School of Technology who came together to create a
						fun and intuitive method for increasing intelligence. We hope you enjoy playing 
						this game as much as we enjoyed making it!</p>
					</div>

					<div className="profiles">
						<div className="aboutProfile">
							<h2>Julian Mullins</h2>
							<p>Front-End</p>
							<img src="images/profiles/julian.jpg" />
							<span className="socialMedia">
								<a target="_blank" href="https://www.linkedin.com/in/mullinsjulian" className="fa fa-linkedin-square fa-2x"></a>
								<a target="_blank" href="mailto:mullinsjulian@gmail.com" className="fa fa-envelope fa-2x"></a>
								<a target="_blank" href="http://www.mullinsjulian.com" className="fa fa-globe fa-2x"></a>
							</span>
						</div>

						<div className="aboutProfile">
							<h2>Adam He</h2>
							<p>Front-End</p>
						</div>

						<div className="aboutProfile">
							<h2>Ruth Bagley</h2>
							<p>Back-End</p>
							<img src="images/profiles/ruth.jpg" />
							<span className="socialMedia">
								<a target="_blank" href="" className="fa fa-linkedin-square fa-2x"></a>
								<a target="_blank" href="" className="fa fa-envelope fa-2x"></a>
								<a target="_blank" href="" className="fa fa-globe fa-2x"></a>
							</span>
						</div>

						<div className="aboutProfile">
						<h2>Taylor Concannon</h2>
							<p>Back-End</p>
							<img src="images/profiles/taylor.jpg" />
							<span className="socialMedia">
								<a target="_blank" href="" className="fa fa-linkedin-square fa-2x"></a>
								<a target="_blank" href="" className="fa fa-envelope fa-2x"></a>
								<a target="_blank" href="" className="fa fa-globe fa-2x"></a>
							</span>
						</div>

						<div className="aboutProfile">
							<h2>Virginia Van Keuren</h2>
							<p>Designer</p>
							<img src="images/profiles/virginia.jpg" />
							<span className="socialMedia">
								<a target="_blank" href="" className="fa fa-linkedin-square fa-2x"></a>
								<a target="_blank" href="" className="fa fa-envelope fa-2x"></a>
								<a target="_blank" href="" className="fa fa-globe fa-2x"></a>
							</span>
						</div>
					</div>
				</div>

				<div className="contactBottom">
					<h1>Contact Us</h1>
					<p>We&#39;d love to hear from you!</p>
					<a target="_blank" href="https://cortexgame.typeform.com/to/xK1GK6" target="_blank">Feedback Form</a>
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