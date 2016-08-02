var React = require('react');
var ReactDOM = require('react-dom');
import {Link} from 'react-router'

var Tutorial = React.createClass({
  getInitialState: function() {
    return {currentIndex: 0}
  },

  componentDidMount: function() {
    var self = this;
    $(document).ready(function() {
      $(window).keydown(function(e) {
        var key = (e.keyCode)
          ? e.keyCode
          : e.which;
        $('.key.k' + key).addClass('active');
        console.log(key);
      });

      $(window).keyup(function(e) {
        var key = (e.keyCode)
          ? e.keyCode
          : e.which;
        $('.key.k' + key).removeClass('active');
      });

      $('.slider').each(function() {
        var $this = $(this);
        var $group = $this.find('.slide_group');
        var $slides = $this.find('.slide');
        var bulletArray = [];
        var timeout;

        function move(newIndex) {
          var animateLeft,
            slideLeft;

          advance();

          if ($group.is(':animated') || self.state.currentIndex === newIndex) {
            return;
          }

          bulletArray[self.state.currentIndex].removeClass('activer');
          bulletArray[newIndex].addClass('activer');

          if (newIndex > self.state.currentIndex) {
            slideLeft = '100%';
            animateLeft = '-100%';
          } else {
            slideLeft = '-100%';
            animateLeft = '100%';
          }

          $slides.eq(newIndex).css({display: 'block', left: slideLeft});
          $group.animate({
            left: animateLeft
          }, function() {
            $slides.eq(self.state.currentIndex).css({display: 'none'});
            $slides.eq(newIndex).css({left: 0});
            $group.css({left: 0});
            self.setState({currentIndex: newIndex});
          });
        }

        function advance() {
          clearTimeout(timeout);
          timeout = setTimeout(function() {
            if (self.state.currentIndex < ($slides.length - 1)) {
              move(self.state.currentIndex + 1);
            } else {
              move(0);
            }
          }, 2000000);
        }

        $('.next_btn').on('click', function() {
          if (self.state.currentIndex < ($slides.length - 1)) {
            move(self.state.currentIndex + 1);
          } else {
            move(0);
          }
        });
        $('.previous_btn').css('display', 'none');
        $('.previous_btn').on('click', function() {
          if (self.state.currentIndex !== 0) {
            move(self.state.currentIndex - 1);
          } else {
            move(3);
          }
        });

        $.each($slides, function(index) {
          var $button = $('<a className="slide_btn">&bull;</a>');

          if (index === self.state.currentIndex) {
            $button.addClass('activer');
          }
          $button.on('click', function() {
            move(index);
          }).appendTo('.slide_buttons');
          bulletArray.push($button);
        });

        advance();
      });
    })
  },
  render: function() {
    if (this.state.currentIndex == 0) {
      $('.previous_btn').css('display', 'none');
    } else {
      $('.previous_btn').css('display', 'block');
    }

    if (this.state.currentIndex == 4) {
      $('.next_btn').css('display', 'none');
    } else {
      $('.next_btn').css('display', 'block');
    }
    return (
      <div className="tutorial">
      <div className="slider">
        <div className="slide_viewer">
          <div className="slide_group">

            <div className="slide">
              <div className="rulemode2">
                <div className="rules2">
                  <h2>Welcome to Cortex!</h2>
                  <p>Cortex is a game designed to exercise your working memory and increase fluid-intelligence (directly tied to IQ). This method of increasing IQ is 
                    <Link to="/science" className="tutorialLink"> scientifically supported and backed by numerous research studies</Link>. 
                    While the game can be tricky to grasp at first and increases in difficulty rather quickly, we have tried to make this game as fun and as easy to 
                    learn as possible. We hope that you’ll enjoy simply playing the game and that the cognitive benefits will follow along as you progress.</p>
                  <h3>Let&#39;s get started!
                  </h3>
                  <img src="./images/brain.png" alt="brain"></img>
                </div>
                {/* rules2 */}
              </div>
              {/* rulemodel2 */}
            </div>
            {/* slide */}

            <div className="slide">
              <div className="rulemode2">
                <div className="rules2">
                  <h2>Dual n-back</h2>
                  <p>Cortex is based on the n-back genre of brain training games which requires players to keep track of various changes happening on-screen. Traditionally the game requires players to keep track of two things: position and sound (the 'dual' in dual n-back). In this game, we have incorporated changing colors as well, and divided up the modes based on the number of things you have to keep track of (mono, dual and triple n-back).</p>
                </div>
              </div>
              {/* rulemode2 */}
              <img src="./images/colorPosition.gif" alt="Color & Position"></img>
            </div>
            {/* slide */}

            <div className="slide">
              <div className="rulemode2">
                <div className="rules2">
                  <h2>The n-back part</h2>
                  <p>The n in n-back refers to the number of positions back that you have to keep track of. The example below demonstrates gameplay at n=2. Therefore, if the current position matches the position it was at two steps back then you would indicate a match by pressing the position key. (The previous slide showed an example of position and color matches at n=1).</p>
                </div>
                {/* rules2 */}
              </div>
              {/* rulemode3 */}
              <img src="./images/nback.gif" alt="Gameplay Pattern"></img>
            </div>
            {/* slide */}

            <div className="slide">
              <div className="key-wrapper">
                <h2>Key Tips</h2>
                <p>Once a button is pressed, you cannot undo the action. For a double match, you need to press both keys</p>
                <div className="rulemode">
                  <div className="rules2">
                    <h3>RELAXED</h3>
                    <p>Keep track of changing position.
                      <br></br>(mono n-back)</p>
                    <ul className="row">
                      <li className="key keyRelaxed k38">POSITION</li>
                    </ul>
                    <ul className="row">
                      <li className="key keyRelaxed k37">←</li>
                      <li className="key keyRelaxed k40">↓</li>
                      <li className="key keyRelaxed k39">→</li>
                    </ul>
                  </div>
                  <div className="rules2">
                    <h3>CLASSIC</h3>
                    <p>Keep track of position and sounds.
                      <br></br>
                      (dual n-back)</p>
                    <ul className="row">
                      <li className="key keyClassic k38">↑</li>
                    </ul>
                    <ul className="row">
                      <li className="key keyClassic k37">POSITION</li>
                      <li className="key keyClassic k40">↓</li>
                      <li className="key keyClassic k39">SOUND</li>
                    </ul>
                  </div>
                  {/* rules2 */}
                </div>
                {/* rulemode */}

                <div className="rulemode">
                  <div className="rules2">
                    <h3>SILENT</h3>
                    <p>Keep track of both position and colors.
                      <br></br>(dual n-back)</p>
                    <ul className="row">
                      <li className="key keySilent k38">↑</li>
                    </ul>
                    <ul className="row">
                      <li className="key keySilent k37">POSITION</li>
                      <li className="key keySilent k40">↓</li>
                      <li className="key keySilent k39">COLOR</li>
                    </ul>
                  </div>
                  <div className="rules2">
                    <h3>ADVANCED</h3>
                    <p>Keep track of position, color and sound
                      <br></br>(triple n-back)</p>
                    <ul className="row">
                      <li className="key keyAdvanced k38">POSITION</li>
                    </ul>
                    <ul className="row">
                      <li className="key keyAdvanced k37">SOUND</li>
                      <li className="key keyAdvanced k40">↓</li>
                      <li className="key keyAdvanced k39">COLOR</li>
                    </ul>
                  </div>
                  {/* rules2 */}
                </div>
                {/* rulemode */}
              </div>
              {/* key-wrapper */}
            </div>
            {/* slide */}

            <div className="slide">
              <div className="rulemode2">
                <div className="rules2">
                  <h2>Expectations</h2>
                  <p>If this seems like a daunting task, don’t worry! This game is designed to be a challenge and advancing up in level can be difficult. If you are new to the game or still unsure of how it works, we recommend starting out in relaxed mode first and then moving on once you are comfortable with the gameplay.
                  </p>

                  <p>Once you&#39;ve become familiar with the game mechanics, it is always recommended to move on after unlocking the next n-level. You will experience the greatest cognitive benefits by continuously challenging yourself!
                  </p>

                  <h3>Ready to begin?</h3>

                  <Link to="/home" className="gameStartBtn playBtn">Start Playing!</Link>
                </div>
              </div>
              {/* rulemode2 */}
            </div>
            {/* slide */}

          </div>
          {/* slide_group */}
        </div>
        {/* slide_viewer */}
      </div>
      {/* slider */}

      <div className="slide_buttons"></div>
      {/* slide_buttons */}

      <div className="directional_nav">
        <div className="previous_btn" title="Previous">
          <i className="fa fa-angle-left" aria-hidden="true"></i>
        </div>
        <div className="next_btn" title="Next">
          <i className="fa fa-angle-right" aria-hidden="true"></i>
        </div>
      </div>
      {/* directional_nav */}
    </div> //tutorial
    )
  }
});

module.exports = Tutorial;
