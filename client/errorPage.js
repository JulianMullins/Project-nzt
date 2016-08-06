var React = require('react');

var ErrorPage = React.createClass({
	getInitialState(){
		return{
			error:decodeURIComponent(this.props.params.error)
		}
	},
	render(){
		return <div>{this.state.error}</div>
	}
})

module.exports = ErrorPage;