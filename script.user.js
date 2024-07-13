// ==UserScript==
// @name         PTZ Web Panel Enhancer
// @namespace    https://dekvited.com
// @version      1.1.0
// @description  Add style and functionality enhancement for the Minrray PTZ web panel that controls it remotely
// @author       totymedli
// @icon         https://raw.githubusercontent.com/dekvidet/ptz-web-panel-enhancer/main/icon.png
// @source       https://github.com/dekvidet/ptz-web-panel-enhancer
// @supportURL   https://github.com/dekvidet/ptz-web-panel-enhancer
// @updateURL    https://raw.githubusercontent.com/dekvidet/ptz-web-panel-enhancer/main/script.user.js
// @downloadURL  https://raw.githubusercontent.com/dekvidet/ptz-web-panel-enhancer/main/script.user.js
// @match        http://*/pages/main.asp
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
const DELAY_BETWEEN_KEYPRESSES_IN_MS = 500

let isHotSwitching = true
let isAutoPaning = false
let isAutoPanLoopInProgress = false
let autoPaningInterval = null
let currentSpeedAmountIndex = 0
let autoPanRightTimeInMs = 2000
let autoPanLeftTimeInMs = 2000

setTimeout(() => {
  const mainWindow = document.getElementById('mainframe').contentWindow
  if (!mainWindow) {
    return
  }
  const mainDocument = mainWindow.document
  addHelp()
  addAutoPan()

  function changeSpeed(amount, vary) {
    const ptzSpeedelement = mainWindow.$(`#${SPEED_SLIDER_ID}`)
    const speed = ptzSpeedelement.slider('getValue')
    switch (vary) {
      case '+':
        ptzSpeedelement.slider('setValue', speed + amount)
        break
      case '-':
        ptzSpeedelement.slider('setValue', speed - amount)
        break
      default:
        ptzSpeedelement.slider('setValue', amount)
    }
  }

  function dispatch(id, eventName) {
    mainDocument.getElementById(id).dispatchEvent(new Event(eventName))
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function autoPanFor(panTimeInMs) {
    isAutoPanLoopInProgress = true
    if (isAutoPaning) {
      await wait(DELAY_BETWEEN_KEYPRESSES_IN_MS)
      dispatch(MOVE_RIGHT_BUTTON_ID, 'mousedown')
      await wait(panTimeInMs)
      dispatch(MOVE_RIGHT_BUTTON_ID, 'mouseup')
    } else {
        isAutoPanLoopInProgress = false
        return
    }
    if (isAutoPaning) {
      await wait(DELAY_BETWEEN_KEYPRESSES_IN_MS)
      dispatch(MOVE_LEFT_BUTTON_ID, 'mousedown')
      await wait(panTimeInMs)
      dispatch(MOVE_LEFT_BUTTON_ID, 'mouseup')
    }
    isAutoPanLoopInProgress = false
  }

  function addHelp() {
      const helpHtml = `
      <div class="helpBtn">
        <div class="helpWindow">
          <ul>
            <li>0-9: Selects camera preset and moves camera to that position if hot switching is enabled.</li>
            <li>+, -: Increase/decrease camera move speed.</li>
            <li>*: Change between camera move speed of 1, 10, 20, 25.</li>
            <li>/: Toggle auto pan mode.</li>
            <li>Shift: Toggle hot switching mode. If turned on, changing the selected preset will also move the camera to that position. Turning it off is usefull when you would like to save the current camera position to a preset without moving the camera to the choosen preset.</li>
            <li>Space: Move the camera to the current preset position. Usefull when you turned off hot switching mode.</li>
            <li>Enter: Save camera position to current preset.</li>
            <li>↑, ↓, ←, →: Pan & tilt camera</li>
            <li>Page Up, Page Down: Zome in & out.</li>
            <li>Home: Set preset to 0 (home/bootup position) and move the camera to that position if hot switching is enabled.</li>
          </ul>
        </div>
      </div>`
      mainDocument.getElementById('rightpreview').insertAdjacentHTML('beforeend', helpHtml)
  }

  function addAutoPan() {
    const autoPanHtml = `
    <td id="autoPanButtonCell">
      <a id="autoPan" href="#" class="trackbtn autopan" title="Auto Pan"></a>
    </td>
    <td id="autoPanTimeCell">
      <span>
        <input type="number" id="autoPanLeftTime" value="2000" />ms
      </span>
      <span>
        <input type="number" id="autoPanRightTime" value="2000" />ms
      </span>
    </td>`
    mainDocument.querySelector('#rightpreview .ptzdiv:nth-of-type(4) tr').insertAdjacentHTML('beforeend', autoPanHtml)
  }

  async function handleAutoPan(event) {
    if (isAutoPaning) {
      clearInterval(autoPaningInterval)
      autoPanButton.classList.remove('borderBlink')
    } else {
      autoPanButton.classList.add('borderBlink')
      dispatch(MOVE_LEFT_BUTTON_ID, 'mousedown')
      await wait(autoPanLeftTimeInMs)
      dispatch(MOVE_LEFT_BUTTON_ID, 'mouseup')
      autoPaningInterval = setInterval(async () => {
        if (isAutoPaning && !isAutoPanLoopInProgress) {
            console.log(autoPanLeftTimeInMs, autoPanRightTimeInMs)
          await autoPanFor(autoPanLeftTimeInMs + autoPanRightTimeInMs)
        }
      }, 50)
    }
    isAutoPaning = !isAutoPaning
  }

  console.log('PTZ Web Panel Enhancer started')

  const autoPanButton = mainDocument.getElementById('autoPan')
  autoPanButton.addEventListener('click', handleAutoPan)

  mainDocument.getElementById('autoPanLeftTime').addEventListener('change', event => {
    autoPanLeftTimeInMs = parseInt(event.target.value, 10)
  });
  // Don't trigger preset load when entering value with number keys
  mainDocument.getElementById('autoPanLeftTime').addEventListener('keypress', event => event.stopPropagation());

  mainDocument.getElementById('autoPanRightTime').addEventListener('change', event => {
    autoPanRightTimeInMs = parseInt(event.target.value, 10)
  });
  // Don't trigger preset load when entering value with number keys
  mainDocument.getElementById('autoPanRightTime').addEventListener('keypress', event => event.stopPropagation());

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
        currentSpeedAmountIndex = 0
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
      case '/': {
        event.preventDefault()
        handleAutoPan()
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
  @keyframes borderBlink {
    from, to {
      border-color: transparent
    }
    50% {
      border-color: red
    }
  }

  .borderBlink {
    animation: borderBlink 1s step-end infinite;
    border: 4px solid black !prevent-important;
    box-sizing: border-box;
  }

  .divPtz.panel-body.panel-body-noheader.panel-body-noborder.layout-body {
    min-width: 215px;
  }

  .head {
    display: none;
  }

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
    order: -4;
  }

  #rightpreview > div:nth-child(4) tr td:nth-child(2) {
    order: -3;
  }

  #autoPanButtonCell {
    order: -2;
  }

  #autoPanTimeCell {
    order: -1;
  }

  #rightpreview > div:nth-child(4) tr td:nth-child(1) {
    display: none;
  }

  #rightpreview > div:nth-child(4) tr td:nth-child(2)::before {
    content: "Preset ";
  }

  #rightpreview > div:nth-child(4) tr td:nth-child(2) {
    margin-bottom: 20px;
  }

  .trackbtn {
    background: none;
  }

  .trackbtn.start, .trackbtn.edit, .trackbtn.delete, .trackbtn.autopan {
    width: 150px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
  }

  .trackbtn.edit {
    background-color: yellow;
    margin-bottom: 7px;
  }

  .trackbtn.edit:before {
    content: 'EDIT';
  }

  .trackbtn.delete {
    background-color: red;
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

  .trackbtn.autopan {
    background-color: green;
    opacity: 0.5;
  }

  .trackbtn.autopan:before {
    content: 'AUTO PAN';
  }

  .trackbtn.autopan:hover {
    opacity: 1;
  }

  #autoPanButtonCell {
    margin-bottom: 2px;
  }

  #autoPanTimeCell {
    margin-bottom: 3px;
  }

  #autoPanTimeCell input {
    width: 50px;
  }

  .helpBtn {
    width: 150px;
    height: 30px;
    text-align: center;
    background-color: #ddd;
    opacity: 0.5;
  }

  .helpBtn:before {
    content: 'HELP';
  }

  .helpBtn:hover {
    background-color: #ccc;
    opacity: 1;
  }

  .helpWindow {
    visibility: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    overflow-y: scroll;
    background-color: white;
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
    // Everything have to be !important to take effect. Sometimes this is undesirable so we undo the replace when !prevent-important is used.
    style.innerHTML = css.replace(/;/g, ' !important;').replace(/!prevent-important !important;/g, ';')
    head.appendChild(style)
  }
}, 2000)
