var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'

var Science = React.createClass({
	render: function() {
		return (
			<div className="cPage">
				<div className="contactPage">
					<h1 className="cHeader">The Science</h1>
					<pl>Cortex implements "dual n-back", a memory exercise that measures working memory, introduced by Wayne Kirchner in 1958. The "n" in n-back stands for how many steps back to recall in the earlier sequences. 1-N means that you have to remember the position/color/sound of the previous step, one step back. 2-N means that you have to remember two steps back, and so forth. </pl>
			</div>
			<div className="contactPage2">
				<h1 className="cHeader">Learn More.</h1>
				<pl>Check out more at this link here.</pl>
				<br></br>
				<a href="http://www.gwern.net/DNB%20FAQ" target="_blank">DUAL N-BACK FAQ</a>
				</div>
		</div>

		)
	}
});

module.exports = Science;
