var React = require('react');
var axios = require('axios');
import {Link} from 'react-router';

var NewUserOverlay = React.createClass({
	render: function() {
		return (
			<div className="overlay">
				<div className="newUserOverlay">
					<h1>First Time Here?</h1>
					<p>How about checking out the <Link to="/tutorial">tutorial page?</Link></p>
					<p>Or, if you want to just jump right in, we recommend you 
					start playing in <Link to="levels/relaxed">relaxed mode</Link> to get the hang of things.</p>				
				</div>
			</div>	
		)
	}
})

module.exports = NewUserOverlay