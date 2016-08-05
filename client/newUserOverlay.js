var React = require('react');
var axios = require('axios');
import {Link} from 'react-router';

var NewUserOverlay = React.createClass({
	render: function() {
		return (
			<div className="overlay">
				<div className="newUserOverlay">
					<div className="newUserTop">
						<h1>First Time Here?</h1>
					</div>
					<div className="newUserMid">
						<p>How about checking out the <Link to="/tutorial">tutorial page?</Link></p>
						<p>If you want to just jump right in, we recommend you 
						start playing in <Link to="levels/relaxed">relaxed mode</Link> first to get the hang of things.</p>
					</div>
					<div className="newUserBottom">
						<Link to="/tutorial">Tutorial</Link>
						<Link to="levels/relaxed">Relaxed Mode</Link>
					</div>								
				</div>
			</div>	
		)
	}
})

module.exports = NewUserOverlay