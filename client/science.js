var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'

var Science = React.createClass({
	render: function() {
		return (
			<div className="sciencePage">
				<div className="scienceTop">
					<div className="scienceTopText">
						<h1>The Science</h1>
						<p>What is dual n-back? N-back tests command a user to keep track of a
						continuously changing pattern, n number of steps back. For example, n=1 means that a user
						should remember 1 step back to see if the next stimulus matches the previous,
						n=2 means keeping track of matching stimuli two steps back, and so on. The
						"dual" in dual n-back refers to the different types of stimulus that the user
						must keep track of, for example, position (a visual input) and sound (an
						auditory input). Combining the two would therefore require a user to keep
						track of both changing positions and sounds at different levels of pattern history.
						In cognitive studies, these tests have been shown to improve working memory
						and fluid intelligence (i.e. reasoning and problem-solving skills). In other
						words, <b>playing these games can improve one&#39;s IQ!</b> In <a target="_blank" href="http://www.pnas.org/content/105/19/6829.full">a study</a> presented in the
						Proceedings of the National Academy of Sciences of the United States of
						America, fluid intelligence increased significantly after just 19 days of
						n-back training, regardless of one&#39;s prior level of intelligence.
						</p>
						<p>
						<b>What does Cortex do?</b> Most current implementations of dual
						n-back training are poorly designed and tedious to play. Our mission is to
						<b> make cognitive training less of a chore through an interactive and gamified
						experience</b>. Users are able to choose their desired level of challenge through
						various modes that range from basic position play all the way to triple n-back
						with three different stimuli to keep track of. Through continuous use, players
						can unlock new n-levels and compete against others around the world for high
						scores and faster reaction times, all while experiencing their own
						improvements over time. We believe that cognitive development works best when it&#39;s a
						fun experience. This is our mission at Cortex. 
						</p>
					</div>
					<img src="./images/brain.png" />
				</div>

				<div className="scienceBottom">
					<h1>Learn More</h1>
					<div className="scienceLinks">
						<a href="http://www.gwern.net/DNB%20FAQ" target="_blank">Dual N-Back FAQ</a>
						<p>|</p>
						<a href="http://www.pnas.org/content/105/19/6829.full" target="_blank">PNAS Study</a>
						<p>|</p>
						<a target="_blank" href="http://blogs.scientificamerican.com/guest-blog/you-can-increase-your-intelligence-5-ways-to-maximize-your-cognitive-potential/">SA Article</a>
					</div>
				</div>
				<Link to="/home"><img className="whiteLogo" src="./images/CortexIconWhite.png" /></Link>
			</div>

		)
	}
});

module.exports = Science;