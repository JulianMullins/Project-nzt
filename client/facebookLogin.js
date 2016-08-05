var React = require('react');

var FacebookLogin = React.createClass({
	getInitialState(){
		if(this.props.params.error){
			return{ 
				error:this.props.params.error,
				toRender: <div>{this.props.params.error}</div>
			}
		}
		else{
			return{toRender:null}
		}
	},
	componentDidMount(){
		console.log("fb login")
		if(!this.state.error){
			if(this.props.location.pathname.includes('gameOver')){
				this.props.history.push('/gameOver');
			}
			else{
				this.props.history.push('/home')
			}
		}
		
	},
	render(){return null;}
})

module.exports = FacebookLogin;