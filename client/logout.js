var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');
import {Link} from 'react-router';

var Logout = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState() {
    //console.log("doing logout")
    return {goHome: false}
  },
  componentDidMount() {
    //console.log("gonna logout")
    axios.post('/api/logout', {withCredentials: true}).then(function(response) {
      //console.log(response.data)
      if (response.data.success) {
        this.context.router.push('/login')
      } else {
        this.context.router.push('/login/logoutFailure')
      }
    }.bind(this))
  },
  render() {
    return null;
  }
})

module.exports = Logout;
