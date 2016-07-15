#Overview#

Project NZT (final name to be determined) is a game centered around the scientifically-backed *dual-n-back* genre of brain games. Although there are various iterations of this idea currently in existence, their design aesthetic and user experience flow is poorly developed. With this version, we are aiming to gamify a powerful mind-training tool and make it as easy as possible for users to engage with and start seeing results.

Research has shown that the majority of so-called “brain training” games are ineffective at increasing IQ and ultimately end up increasing a user’s ability to play that certain game, rather than enhancing their overall intelligence (think sudoku, crosswords, etc.). However, various research efforts have demonstrated that dual-n-back games have the surprising ability to affect a player’s working memory and increase overall fluid intelligence (directly tied to IQ). With the right combination of simplicity in design and a gamified experience tied to the underlying science of dual-n-back brain-training, our application is at an exciting breakthrough point. Rather than pitching the product as a brain-training device, we will focus on the experience as a game first and foremost, with the IQ increases touted as a side-effect of continuous play.

#Components#
Our application will have the following elements:
* Primarily an app, but with a web version (we will probably begin by creating the web app, and then make ios and android compatible apps before launch)
* First-time optional tutorial to guide new users into the game and help them understand how to play. We will first present users with position-based play, then guide them through sound-based play before combining them both and then taking them to the main page.
* The main page will prominently feature an interactive game-mode selector so that the user can choose which mode they’d like to play (normal play presented first and other modes will remain locked until the user reaches a certain n level)
* Replay tutorial mode
* Register/login to keep track of statistics
* About
* Science (the scientific research and findings about the game)
* Settings


#Modes of Play#
Normal play (position and sound)
* Position-only (good for learning to play the game but is not as effective at increasing fluid intelligence)
* Position and color (when users don’t want to play with sound)
* Triple n-back which combines color, position and sound (advanced)

#Additional Features/Comments#
* Users should be able to play either with keyboard shortcuts or by clicking on buttons in the application window (and of course by touch on mobile)
* Sounds should be a short list of distinct letters (C, H, K, L, Q, R, S, T) but we could also add in an audio numbers list (1-9 for example) or other sounds that could be changed in settings
* Develop an algorithm to generate a new semi-random array of positions/sounds/colors for each game played
* UI response on a user error, ie. when an incorrect position is clicked, the square should turn red and when the sound button is called at the incorrect time an auditory response should be triggered
* (long-term): multi-play mode between users: friends playing on a shared board to compete for highest score and/or fastest reaction time
* Users score would be based on the number of correct pairs matched over the course of the game. Certain score thresholds would be necessary for players to unlock more advanced levels (longer patterns, more variables to keep track of at once, etc)
* Statistics would show user playing history and scores/improvement over time

#Technologies#
We will be using Express.js for the routes and models while rendering the front-end design with React, in tandem with React Native for the mobile application.

#Data Models, Routes, etc.
Data Models/Routes/Views
Data Models:
User:
High score
Username
Password
Facebookid
Preferred settings (remember previous settings)
Game:
Board (static model with brief animations?)
Score
Mode (relaxed, timed, or number of lives)
N array (array of length n+1 to test if button press is valid/when there is a match)
Type - sound/color/position
userid

Routes/Views
login (get, post)
facebook(passport - get/post)
registration (get, post)
how to play (get)
settings (get,post)
We’re still working on how settings will be displayed/set, so we might not have this view, depending
how it works (background/scientific info) (get)
game (get,post)

Authentication:
Regular/app-internal
facebook (passport)
Remember login credentials on phone app through React Native (AsyncStorage)

#Timeline/prioritized features
Timeline (grouped by priority level)
Game board and basic functionality with react
Create random generator/algorithms for position/sound
Create models/routes
First version gamepage design/graphics

Home page/other views
Different modes/settings
Users/authentication
About page/scientific background
UI
Keyboard shortcuts
Scoring

Mobile version
Facebook integration (see friend’s progress, etc.)
Tutorial
Triple n-back and adjusting algorithm
Statistics

Multiplayer mode
