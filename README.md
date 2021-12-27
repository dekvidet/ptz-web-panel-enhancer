# PTZ Web Panel Enhancer

Userscript to enhance the remote control web panel for the Minrray UV510A PTZ camera.
It improves the display and layout of the buttons for easier mouse or touch operation and adds shortcuts so it can be controlled via keyboard.
It was not tested with other Minrray products but it probably works with them as well. Avonic PTZ cameras look almost identical so it might work for them as well.
Some modifications might be necessary to the script for these untested products.

## Features
- Improved CSS for better button colors and layout for easier mouse and touch operation.
- Shortcuts for keyboard control:
  - <kbd>0</kbd>-<kbd>9</kbd>: Selects camera preset and moves camera to that position if hot switching is enabled.
  - <kbd>Shift</kbd>: Toggle hot switching mode. If turned on changing the selected preset will also move the camera to that position. Turning it off is usefull when you would like to save the current camera position to a preset without moving the camera to the choosen preset.
  - <kbd>Space</kbd>: Move the camera to the current preset position. Usefull when you turned off hot switching mode.
  - <kbd>Enter</kbd>: Save camera position to current preset.
  - <kbd>↑</kbd>, <kbd>↓</kbd>, <kbd>←</kbd>, <kbd>→</kbd>: pan & tilt camera
  - <kbd>Page Up</kbd>, <kbd>Page Down</kbd>: Zome in & out.
  - <kbd>Home</kbd>: Set preset to 0 (home/bootup position) and move the camera to that position if hot switching is enabled.
 
## Installation
1. Download Tampermonkey for [Firefox](https://addons.mozilla.org/hu/firefox/addon/tampermonkey) or [Chromium](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) based browsers (Chrome, Vivaldi, Opera, Brave, Edge).
1. Click on the Tampermonkey extension's icon and select "Create a new script..."
1. Copy & Paste the content of [userscript.js](/userscript.js) to there.
1. Change the IP address in the `// @match` line to your PTZ camera's IP address.
1. Save the script and reload your PTZ camera's web panel.
