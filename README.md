# PTZ Web Panel Enhancer
[![badge](https://img.shields.io/badge/INSTALL-red?style=for-the-badge&logo=tampermonkey&logoColor=black)](https://raw.githubusercontent.com/dekvidet/ptz-web-panel-enhancer/main/script.user.js)

Userscript to enhance the remote control web panel for the Minrray UV510A PTZ camera.
It improves the display and layout of the buttons for easier mouse or touch operation and adds shortcuts so it can be controlled via keyboard.
It was not tested with other Minrray products but it probably works with them as well. Avonic PTZ cameras look almost identical so it might work for them as well.
Some modifications might be necessary to the script for these untested products.

## Features
- Improved CSS for better button colors and layout for easier mouse and touch operation.
- Auto pan feature to continously move the camera left and right in a repeating manner with custom time delays.
- Shortcuts for keyboard control:
  - <kbd>0</kbd>-<kbd>9</kbd>: Selects camera preset and moves camera to that position if hot switching is enabled.
  - <kbd>+</kbd>, <kbd>-</kbd>: Increase/decrease camera move speed.
  - <kbd>*</kbd>: Change between camera move speed of 1, 10, 20, 25.
  - <kbd>/</kbd>: Toggle auto pan mode.
  - <kbd>Shift</kbd>: Toggle hot switching mode. If turned on changing the selected preset will also move the camera to that position. Turning it off is usefull when you would like to save the current camera position to a preset without moving the camera to the choosen preset.
  - <kbd>Space</kbd>: Move the camera to the current preset position. Usefull when you turned off hot switching mode.
  - <kbd>Enter</kbd>: Save camera position to current preset.
  - <kbd>↑</kbd>, <kbd>↓</kbd>, <kbd>←</kbd>, <kbd>→</kbd>: pan & tilt camera
  - <kbd>Page Up</kbd>, <kbd>Page Down</kbd>: Zome in & out.
  - <kbd>Home</kbd>: Set preset to 0 (home/bootup position) and move the camera to that position if hot switching is enabled.
 
## Installation
1. Download Tampermonkey for [Firefox](https://addons.mozilla.org/hu/firefox/addon/tampermonkey) or [Chromium](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) based browsers (Chrome, Vivaldi, Opera, Brave, Edge).
1. [Open the userscript source to install it!](https://raw.githubusercontent.com/dekvidet/ptz-web-panel-enhancer/main/script.user.js) (modern userscript engines provide an install and update system)
