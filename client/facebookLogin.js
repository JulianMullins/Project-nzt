var React = require('react');

var FacebookLogin = React.createClass({
	componentDidMount(){
		console.log("fb login")
		if(this.props.location.pathname.includes('gameOver')){
			this.props.history.go(2)
		}
		else{
			this.props.history.push('/home')
		}
	},
	render(){return null;}
})

module.exports = FacebookLogin;