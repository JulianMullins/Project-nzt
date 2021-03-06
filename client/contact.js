var React = require('react');
var ReactDOM = require('react-dom');
import {Link} from 'react-router'

var Contact = React.createClass({
  render: function() {
    return (
      <div className="contactPage">
        <div className="contactTop">
          <div className="contactTopHeading">
            <h1>About Us</h1>
            <p>We are a team of college students from the Horizons School of Technology who came together to create a fun and intuitive method for increasing intelligence. We hope you enjoy playing this game as much as we enjoyed making it!</p>
          </div>
        </div>

        <div className="contactMid">
          <div className="profiles">
            <div className="aboutProfile">
              <div className="profileInfo">
                <h2>Julian Mullins</h2>
                <p><i>Product Manager / Front-End</i></p>
              </div>
              <img src="images/profiles/julian.jpg"/>
              <span className="socialMedia">
                <a target="_blank" href="https://www.linkedin.com/in/mullinsjulian" className="fa fa-linkedin-square fa-2x"></a>
                <a target="_blank" href="https://github.com/JulianMullins" className="fa fa-github fa-2x"></a>
                <a target="_blank" href="http://www.mullinsjulian.com" className="fa fa-globe fa-2x"></a>
              </span>
            </div>

            <div className="aboutProfile">
              <div className="profileInfo">
                <h2>Adam He</h2>
                <p><i>Front-End</i></p>
              </div>
              <img src="images/profiles/adam.jpg"/>
              <span className="socialMedia">
                <a target="_blank" href="https://www.linkedin.com/in/shuaihe" className="fa fa-linkedin-square fa-2x"></a>
                <a target="_blank" href="https://github.com/AdamHe17" className="fa fa-github fa-2x"></a>
                <a target="_blank" href="http://www.adamhe.me/" className="fa fa-globe fa-2x"></a>
              </span>
            </div>

            <div className="aboutProfile">
              <div className="profileInfo">
                <h2>Ruth Bagley</h2>
                <p><i>Back-End</i></p>
              </div>
              <img src="images/profiles/ruth.jpg"/>
              <span className="socialMedia">
                <a target="_blank" href="https://www.linkedin.com/in/ruth-bagley-24781996" className="fa fa-linkedin-square fa-2x"></a>
                <a target="_blank" href="https://github.com/rebagley" className="fa fa-github fa-2x"></a>
                <a target="_blank" href="mailto:ruthbagley16@gmail.com" className="fa fa-envelope fa-2x"></a>
              </span>
            </div>

            <div className="aboutProfile">
              <div className="profileInfo">
                <h2>Taylor Concannon</h2>
                <p><i>Front-End</i></p>
              </div>
              <img src="images/profiles/taylor.jpg"/>
              <span className="socialMedia">
                <a target="_blank" href="https://www.linkedin.com/in/taylor-concannon-b2706097" className="fa fa-linkedin-square fa-2x"></a>
                <a target="_blank" href="https://github.com/tconcannon" className="fa fa-github fa-2x"></a>
                <a target="_blank" href="mailto:taycon@seas.upenn.edu" className="fa fa-envelope fa-2x"></a>
              </span>
            </div>

            <div className="aboutProfile">
              <div className="profileInfo">
                <h2>Virginia Van Keuren</h2>
                <p><i>Product Designer</i></p>
              </div>
              <img src="images/profiles/virginia.jpg"/>
              <span className="socialMedia">
                <a target="_blank" href="https://www.linkedin.com/in/virginiavankeuren" className="fa fa-linkedin-square fa-2x"></a>
                <a target="_blank" href="https://github.com/vankevk" className="fa fa-github fa-2x"></a>
                <a target="_blank" href="mailto:virginiavk@u.northwestern.edu" className="fa fa-envelope fa-2x"></a>
              </span>
            </div>
          </div>
        </div> {/* contactMid */}

        <div className="contactBottom">
          <h1>Contact Us</h1>
          <p>We&#39;d love to hear from you!</p>
          <div className="contactLinks">
            <a target="_blank" href="https://cortexgame.typeform.com/to/xK1GK6">Feedback Form</a>
            <a target="_blank" href="mailto:contactcortexgame@gmail.com">Email Us</a>
          </div>
        </div>
        <Link to="/home"><img className="whiteLogo" src="./images/CortexIconWhite.png"/></Link>
      </div>
    )
  }
});

module.exports = Contact;
