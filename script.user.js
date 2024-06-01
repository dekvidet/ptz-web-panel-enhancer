 
// ==UserScript==
// @name         PTZ Web Panel Enhancer
// @namespace    https://dekvited.com
// @version      1.0
// @description  Add style and functionality enhancement for the Minrray PTZ web panel that controls it remotely
// @author       totymedli
// @icon         https://raw.githubusercontent.com/dekvidet/ptz-web-panel-enhancer/main/icon.png
// @source       https://github.com/dekvidet/ptz-web-panel-enhancer
// @supportURL   https://github.com/dekvidet/ptz-web-panel-enhancer
// @updateURL    https://raw.githubusercontent.com/dekvidet/ptz-web-panel-enhancer/main/script.user.js
// @downloadURL  https://raw.githubusercontent.com/dekvidet/ptz-web-panel-enhancer/main/script.user.js
// @match        http://10.*.*/pages/main.asp
// @match        http://172.1[6-9].*/pages/main.asp
// @match        http://172.2[0-9].*/pages/main.asp
// @match        http://172.3[0-1].*/pages/main.asp
// @match        http://192.168.*.*/pages/main.asp
// @grant        none
// ==/UserScript==
const CAMERA_NUMBER_OPTION_ID_BASE = '_easyui_combobox_i1_'
const GO_TO_POSITION_BUTTON_ID = 'prerun'
const SAVE_POSITION_BUTTON_ID = 'preset'
const SPEED_SLIDER_ID = 'ptzSpeed'
const ZOOM_IN_BUTTON_ID = 'ptzZoomIn'
const ZOOM_OUT_BUTTON_ID = 'ptzZoomOut'
const MOVE_UP_BUTTON_ID = 'ptzUp'
const MOVE_DOWN_BUTTON_ID = 'ptzDown'
const MOVE_LEFT_BUTTON_ID = 'ptzLeft'
const MOVE_RIGHT_BUTTON_ID = 'ptzRight'
const SPEED_AMOUNTS = [1, 10, 20, 25]

let isHotSwitching = true
let currentSpeedAmountIndex = 0

setTimeout(() => {
  const mainWindow = document.getElementById('mainframe').contentWindow
  const mainDocument = mainWindow.document
  addHelp()

  function changeSpeed(amount, vary) {
    const ptzSpeedelement = mainWindow.$(`#${SPEED_SLIDER_ID}`)
    const speed = ptzSpeedelement.slider('getValue')
    switch (vary) {
      case '+':
        ptzSpeedelement.slider('setValue', speed + amount)
        break;
      case '-':
        ptzSpeedelement.slider('setValue', speed - amount)
        break;
      default:
        ptzSpeedelement.slider('setValue', amount)
    }
  }

  function addHelp() {
      const helpHtml = `
      <div class="helpBtn">
        <div class="helpWindow">
          <ul>
            <li>0-9: Selects camera preset and moves camera to that position if hot switching is enabled.</li>
            <li>+, -: Increase/decrease camera move speed.</li>
            <li>*: Change between camera move speed of 1, 10, 20, 25.</li>
            <li>Shift: Toggle hot switching mode. If turned on, changing the selected preset will also move the camera to that position. Turning it off is usefull when you would like to save the current camera position to a preset without moving the camera to the choosen preset.</li>
            <li>Space: Move the camera to the current preset position. Usefull when you turned off hot switching mode.</li>
            <li>Enter: Save camera position to current preset.</li>
            <li>↑, ↓, ←, →: Pan & tilt camera</li>
            <li>Page Up, Page Down: Zome in & out.</li>
            <li>Home: Set preset to 0 (home/bootup position) and move the camera to that position if hot switching is enabled.</li>
          </ul>
        </div>
      </div>`
      mainDocument.getElementById('rightpreview').insertAdjacentHTML('beforeend', helpHtml);
  }

  console.log('PTZ Web Panel Enhancer started')

  mainDocument.addEventListener('keypress', event => {
    if (0 <= event.key && event.key <= 9) {
      mainDocument.getElementById(`${CAMERA_NUMBER_OPTION_ID_BASE}${event.key}`).click()
      if (isHotSwitching) {
        mainDocument.getElementById(GO_TO_POSITION_BUTTON_ID).click()
      }
    }
  })

  mainDocument.addEventListener('keydown', event => {
    console.log(event.key)
    switch (event.key) {
      case 'Home': {
        event.preventDefault()
        if (!event.repeat) {
          mainDocument.getElementById(`${CAMERA_NUMBER_OPTION_ID_BASE}0`).click()
          if (isHotSwitching) {
            mainDocument.getElementById(GO_TO_POSITION_BUTTON_ID).click()
          }
        }
        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        if (!event.repeat) {
          mainDocument.getElementById(MOVE_UP_BUTTON_ID).dispatchEvent(new Event('mousedown'))
        }
        break
      }
      case 'ArrowDown': {
        event.preventDefault()
        if (!event.repeat) {
          mainDocument.getElementById(MOVE_DOWN_BUTTON_ID).dispatchEvent(new Event('mousedown'))
        }
        break
      }
      case 'ArrowLeft': {
        event.preventDefault()
        if (!event.repeat) {
          mainDocument.getElementById(MOVE_LEFT_BUTTON_ID).dispatchEvent(new Event('mousedown'))
        }
        break
      }
      case 'ArrowRight': {
        event.preventDefault()
        if (!event.repeat) {
          mainDocument.getElementById(MOVE_RIGHT_BUTTON_ID).dispatchEvent(new Event('mousedown'))
        }
        break
      }
      case 'PageUp': {
        event.preventDefault()
        if (!event.repeat) {
          mainDocument.getElementById(ZOOM_IN_BUTTON_ID).dispatchEvent(new Event('mousedown'))
        }
        break
      }
      case 'PageDown': {
        event.preventDefault()
        if (!event.repeat) {
          mainDocument.getElementById(ZOOM_OUT_BUTTON_ID).dispatchEvent(new Event('mousedown'))
        }
        break
      }
      case '-': {
        event.preventDefault()
        changeSpeed(SPEED_AMOUNTS[currentSpeedAmountIndex], '-')
        break
      }
      case '+': {
        event.preventDefault()
        changeSpeed(SPEED_AMOUNTS[currentSpeedAmountIndex], '+')
        break
      }
      case '/': {
        event.preventDefault()
        mainDocument.getElementById(SPEED_SLIDER_ID).value = 0
        break
      }
      case '*': {
        event.preventDefault()
        mainDocument.getElementById(SPEED_SLIDER_ID).value = 100
        break
      }
      case 'Shift': {
        event.preventDefault()
        if (!event.repeat) {
          isHotSwitching = !isHotSwitching
        }
        break
      }
      case '*': {
        event.preventDefault()
        ++currentSpeedAmountIndex
        if (currentSpeedAmountIndex >= SPEED_AMOUNTS.length) {
          currentSpeedAmountIndex = 0
        }
        break
      }
      case ' ': {
        event.preventDefault()
        if (!event.repeat) {
          mainDocument.getElementById(GO_TO_POSITION_BUTTON_ID).click()
        }
        break
      }
      case 'Enter': {
        event.preventDefault()
        if (!event.repeat) {
          mainDocument.getElementById(SAVE_POSITION_BUTTON_ID).click()
        }
        break
      }
    }
  })


  mainDocument.addEventListener('keyup', event => {
    switch (event.key) {
      case 'ArrowUp': {
        event.preventDefault()
        if (!event.repeat) {
          mainDocument.getElementById(MOVE_UP_BUTTON_ID).dispatchEvent(new Event('mouseup'))
        }
        break
      }
      case 'ArrowDown': {
        event.preventDefault()
        if (!event.repeat) {
          mainDocument.getElementById(MOVE_DOWN_BUTTON_ID).dispatchEvent(new Event('mouseup'))
        }
        break
      }
      case 'ArrowLeft': {
        event.preventDefault()
        if (!event.repeat) {
          mainDocument.getElementById(MOVE_LEFT_BUTTON_ID).dispatchEvent(new Event('mouseup'))
        }
        break
      }
      case 'ArrowRight': {
        event.preventDefault()
        if (!event.repeat) {
          mainDocument.getElementById(MOVE_RIGHT_BUTTON_ID).dispatchEvent(new Event('mouseup'))
        }
        break
      }
      case 'PageUp': {
        event.preventDefault()
        if (!event.repeat) {
          mainDocument.getElementById(ZOOM_IN_BUTTON_ID).dispatchEvent(new Event('mouseup'))
        }
        break
      }
      case 'PageDown': {
        event.preventDefault()
        if (!event.repeat) {
          mainDocument.getElementById(ZOOM_OUT_BUTTON_ID).dispatchEvent(new Event('mouseup'))
        }
        break
      }
    }
  })

  addGlobalStyle(`
  #rightpreview {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #rightpreview > div:nth-child(4) tr {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #rightpreview > div:nth-child(4) tr td:nth-child(5) {
    order: -1;
  }

  #rightpreview > div:nth-child(4) tr td:nth-child(2) {
    margin-bottom: 250px;
  }

  .trackbtn {
    background: none;
  }

  .trackbtn.start, .trackbtn.edit, .trackbtn.delete {
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
  }

  .trackbtn.edit {
    background-color: yellow;
    width: 150px;
    height: 30px;
    margin-bottom: 20px;
  }

  .trackbtn.edit:before {
    content: 'EDIT';
  }

  .trackbtn.delete {
    background-color: red;
    width: 150px;
    height: 30px;
  }

  .trackbtn.delete:before {
    content: 'DELETE';
  }

  .trackbtn.start {
    background-color: green;
    height: 100px;
  }

  .trackbtn.start:before {
    font-size: 40px;
    content: 'GO';
  }

  .helpBtn {
    width: 150px;
    height: 30px;
    text-align: center;
    background-color: #ddd;
  }

  .helpBtn:before {
    content: 'HELP';
  }

  .helpBtn:hover {
    background-color: #ccc;
  }

  .helpWindow {
    visibility: hidden;
    width: 100%;
    background-color: white;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  .helpBtn:hover .helpWindow {
    visibility: visible;
  }

  .helpWindow ul {
    text-align: left;
  }
  `)

  function addGlobalStyle(css) {
    const head = mainDocument.getElementsByTagName('head')[0]
    if (!head) { return }
    const style = mainDocument.createElement('style')
    style.type = 'text/css'
    style.innerHTML = css.replace(/;/g, ' !important;')
    head.appendChild(style)
  }
}, 2000)
