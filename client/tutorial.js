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
					<h4>There is only one button: Position. This will be your ↑ key.</h4>
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
          <h4>There are two buttons: Position and Sound. This will be your ← and → keys.</h4>
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
				<div className="rulemode2">
            <div className="rules2">
							<h2>SILENT</h2>
							<h4>There are two buttons: Position and Color. This will be your ← and → keys.</h4>
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
              <h4>There are three buttons: Position Sound, and Color.</h4>
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
				</div>
				<div className="slide">
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
