var React = require('react');

var Leaderboard = React.createClass({
	render: function() {
		return (
			<div className="leaderboardPage">
				<div className="userSide">
					<h1 className="lbHeader">Statistics</h1>
				</div>

				<div className="boardSide">
					<h1 className="lbHeader">Leaderboards</h1>
				</div>
			</div>
		)
	}
});

module.exports = Leaderboard
