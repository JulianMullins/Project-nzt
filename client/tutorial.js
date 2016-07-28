var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'

var Tutorial = React.createClass({

componentDidMount: function(){
	$(document).ready(function() {
	$(window).keydown(function(e) {
		var key = (e.keyCode) ? e.keyCode : e.which;
		$('.key.k' + key).addClass('active');
		console.log(key);
	});

	$(window).keyup(function(e) {
		var key = (e.keyCode) ? e.keyCode : e.which;
		$('.key.k' + key).removeClass('active');
	});

	$('.slider').each(function() {
  var $this = $(this);
  var $group = $this.find('.slide_group');
  var $slides = $this.find('.slide');
  var bulletArray = [];
  var currentIndex = 0;
  var timeout;

  function move(newIndex) {
    var animateLeft, slideLeft;

    advance();

    if ($group.is(':animated') || currentIndex === newIndex) {
      return;
    }

    bulletArray[currentIndex].removeClass('activer');
    bulletArray[newIndex].addClass('activer');

    if (newIndex > currentIndex) {
      slideLeft = '100%';
      animateLeft = '-100%';
    } else {
      slideLeft = '-100%';
      animateLeft = '100%';
    }

    $slides.eq(newIndex).css({
      display: 'block',
      left: slideLeft
    });
    $group.animate({
      left: animateLeft
    }, function() {
      $slides.eq(currentIndex).css({
        display: 'none'
      });
      $slides.eq(newIndex).css({
        left: 0
      });
      $group.css({
        left: 0
      });
      currentIndex = newIndex;
    });
  }

  function advance() {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      if (currentIndex < ($slides.length - 1)) {
        move(currentIndex + 1);
      } else {
        move(0);
      }
    }, 2000000);
  }

  $('.next_btn').on('click', function() {
    if (currentIndex < ($slides.length - 1)) {
      move(currentIndex + 1);
    } else {
      move(0);
    }
  });

  $('.previous_btn').on('click', function() {
    if (currentIndex !== 0) {
      move(currentIndex - 1);
    } else {
      move(3);
    }
  });

  $.each($slides, function(index) {
    var $button = $('<a className="slide_btn">&bull;</a>');

    if (index === currentIndex) {
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
		return (
      <div className="tutorial">
        <div className="slider">
          <div className="slide_viewer">
            <div className="slide_group">

              <div className="slide">
                <div className="rulemode2">
                  <div className="rules2">
                    <h2>Welcome to Cortex!</h2>
                    <p>Cortex is a <spanl>scientifically supported</spanl> game for exercising your working memory
                    and increasing fluid-intelligence (directly tied to IQ). While the game can be tricky to grasp
                    at first and increases in difficulty rather quickly, we have tried to make this game as fun and
                    as easy to learn as possible. We hope that you’ll enjoy playing this game and that the cognitive
                    benefits will simply follow along as you progress.</p>
									<img src="./images/brain.png" alt="BRAIN"></img>
                    <div className="started">Let’s get started!</div>
                  </div> {/* rules2 */}
                </div> {/* rulemodel2 */}
              </div> {/* slide */}

              <div className="slide">
                <div className="rulemode2">
                  <div className="rules2">
                  <h2>Dual n-back</h2>
                    <p>Cortex is based on the n-back genre of brain training games, which requires players to keep
                  track of various changes happening on-screen.</p>
                  </div>
                </div> {/* rulemode2 */}
                  <img src="./images/pattern.gif" alt="Mountain View"></img>
              </div> {/* slide */}

              <div className="slide">
                <div className="key-wrapper">
                <h2>Key Tips</h2>
                <p>Once a button is pressed, you cannot undo the action.
									<br></br>
                For a double match, you need to press both keys.</p>
                  <div className="rulemode">
                    <div className="rules2">
                      <h2>RELAXED</h2>
                      <h3>Keep track of changing position. <br></br>(mono n-back)</h3>
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
                      <h2>CLASSIC</h2>
                      <h3>Keep track of position and sounds. <br></br> (dual n-back)</h3>
                      <ul className="row">
                        <li className="key keyClassic k38">↑</li>
                      </ul>
                      <ul className="row">
                        <li className="key keyClassic k37">POSITION</li>
                        <li className="key keyClassic k40">↓</li>
                        <li className="key keyClassic k39">SOUND</li>
                      </ul>
                    </div> {/* rules2 */}
                  </div> {/* rulemode */}

                  <div className="rulemode">
                    <div className="rules2">
                      <h2>SILENT</h2>
                      <h3>Keep track of both position and colors. <br></br>(dual n-back)</h3>
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
                      <h2>ADVANCED</h2>
                      <h3>Keep track of position, color and sound <br></br>(triple n-back)</h3>
                      <ul className="row">
                        <li className="key keyAdvanced k38">POSITION</li>
                      </ul>
                      <ul className="row">
                        <li className="key keyAdvanced k37">SOUND</li>
                        <li className="key keyAdvanced k40">↓</li>
                        <li className="key keyAdvanced k39">COLOR</li>
                      </ul>
                    </div> {/* rules2 */}
                  </div> {/* rulemode */}
                </div> {/* key-wrapper */}
              </div> {/* slide */}

              <div className="slide">
                <div className="rulemode2">
                  <div className="rules2">
                  <h2>The n-back part</h2>
                    <p>The n in n-back refers to the number of positions back that you have to keep track of.
											<br></br>
                    For example, at n=2, you would have to make matches based on the state of the board two steps back. </p>
                  </div> {/* rules2 */}
                </div> {/* rulemode3 */}
                <img src="./images/pattern.gif" alt="Gameplay Pattern"></img>
              </div> {/* slide */}

              <div className="slide">
                <div className="rulemode2">
                  <div className="rules2">
                  <h2>Expectations</h2>
                    <p>If this seems like a daunting task, don’t worry! This game is designed to be a challenge and advancing
                    up in level can be difficult. If you are new to the game or still unsure of how it works, we recommend
                    starting out in relaxed mode first and then moving on once you are comfortable with the gameplay. </p>

                    <p>However, once you get familiar with the game mechanics, it is always recommended to continue pushing
                    up in n-level once you have unlocked the next one. You will experience the greatest mental benefits by
                    continuously challenging yourself! </p>
                  </div>
                </div> {/* rulemode2 */}
              </div> {/* slide */}

            </div> {/* slide_group */}
          </div> {/* slide_viewer */}
        </div> {/* slider */}

        <div className="slide_buttons">
        </div> {/* slide_buttons */}

        <div className="directional_nav">
          <div className="previous_btn" title="Previous"><i className="fa fa-angle-left" aria-hidden="true"></i>
          </div>
          <div className="next_btn" title="Next"><i className="fa fa-angle-right" aria-hidden="true"></i>
          </div>
        </div> {/* directional_nav */}
      </div> //tutorial
    )
	}
});

module.exports = Tutorial;
