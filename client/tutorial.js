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
    }, 20000);
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
				<h4>Cortex is a <spanl>scientifically supported</spanl> game for exercising your working memory and increasing fluid-intelligence (directly tied to IQ). While the game can be tricky to grasp at first and increases in difficulty rather quickly, we have tried to make this game as fun and as easy to learn as possible. We hope that you’ll enjoy playing this game and that the cognitive benefits will simply follow along as you progress.</h4>
					<h3>Let’s get started!</h3>
			</div>
			</div>
			</div>
			<div className="slide">
				<div className="rulemode2">
					<div className="rules2">
				<h4>Cortex is based on the n-back genre of brain training games, which requires players to keep track of various changes happening on-screen.</h4>
				</div>
			</div>
				<img src="./images/pattern.gif" alt="Mountain View"></img>
	</div>
      <div className="slide">
	      <div className="key-wrapper">
        <h4>Click <spanl>here</spanl> to test your keys.</h4>
        <ul className="row">
          <li className="key k38">↑</li>
        </ul>

        <ul className="row">
          <li className="key k37">←</li>
          <li className="key k40">↓</li>
          <li className="key k39">→</li>
        </ul>
        <h4>Once pressed, you cannot undo it. For a double match, you need to press both keys.</h4>
        <div className="rulemode">
					<div className="rules2">
        <h2>RELAXED</h2>
					<h3>Keep track of changing position. <br></br>(mono n-back)</h3>
          <ul className="row">
            <li className="key k38">POSITION</li>
          </ul>
					<ul className="row">
						<li className="key k37">←</li>
						<li className="key k40">↓</li>
						<li className="key k39">→</li>
						</ul>
					</div>
					<div className="rules2">
						<h2>CLASSIC</h2>
          <h3>Keep track of position and sounds. <br></br> (dual n-back)</h3>
						<ul className="row">
							<li className="key k38">↑</li>
						</ul>
            <ul className="row">
              <li className="key k37">POSITION</li>
              <li className="key k40">↓</li>
              <li className="key k39">SOUND</li>
            </ul>
					</div>
				</div>
				<div className="rulemode">
            <div className="rules2">
							<h2>SILENT</h2>
							<h3>Keep track of both position and colors. <br></br>(dual n-back)</h3>
              <ul className="row">
								<li className="key k38">↑</li>
							</ul>
							<ul className="row">
                <li className="key k37">POSITION</li>
                <li className="key k40">↓</li>
                <li className="key k39">COLOR</li>
              </ul>
						</div>
						<div className="rules2">
							<h2>ADVANCED</h2>
              <h3>Keep track of position, color and sound <br></br>(triple n-back)</h3>
                <ul className="row">
                  <li className="key k38">POSITION</li>
                </ul>
                <ul className="row">
                  <li className="key k37">SOUND</li>
                  <li className="key k40">↓</li>
                  <li className="key k39">COLOR</li>
                </ul>
						</div>
          </div>
      </div>
		</div>
				<div className="slide">
					<div className="rulemode3">
						<div className="rules2">
<h4>The n in n-back refers to the number of positions back that you have to keep track of. For example, at n=2, you would have to make matches based on the state of the board two steps back.
	<br></br>
	<br></br>
	<br></br>

If this seems like a daunting task, don’t worry! This game is designed to be a challenge and advancing up in level can be difficult. If you are new to the game or still unsure of how it works, we recommend starting out in relaxed mode first and then moving on once you are comfortable with the gameplay.
<br></br>
	<br></br>
	<br></br>

However, once you get familiar with the game mechanics, it is always recommended to continue pushing up in n-level once you have unlocked the next one. You will experience the greatest mental effects by continuously challenging yourself!
</h4>
						</div>
					</div>
						<img src="./images/pattern.gif" alt="Mountain View"></img>
				</div>
				<div className="slide">
				</div>
		</div>
		</div>
		</div>

		<div className="slide_buttons">
		</div>

		<div className="directional_nav">
		<div className="previous_btn" title="Previous"><i className="fa fa-angle-left" aria-hidden="true"></i>
		</div>
		<div className="next_btn" title="Next"><i className="fa fa-angle-right" aria-hidden="true"></i>
		</div>
		</div>
    </div>
    )
	}
});

module.exports = Tutorial;
