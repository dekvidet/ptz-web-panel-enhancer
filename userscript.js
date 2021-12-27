 
// ==UserScript==
// @name         PTZ Web Panel Enhancer
// @namespace    ptz-web-panel-enhancer
// @version      0.1
// @description  Add style and functionality enhancement for the Minrray PTZ web panel that controls it remotely
// @author       totymedli
// @match        http://192.168.1.100/pages/main.asp
// @grant        none
// ==/UserScript==

const CAMERA_NUMBER_OPTION_ID_BASE = '_easyui_combobox_i1_'
const GO_TO_POSITION_BUTTON_ID = 'prerun'
const SAVE_POSITION_BUTTON_ID = 'preset'
const SPEED_SLIDER_ID = ''
const ZOOM_IN_BUTTON_ID = 'ptzZoomIn'
const ZOOM_OUT_BUTTON_ID = 'ptzZoomOut'
const MOVE_UP_BUTTON_ID = 'ptzUp'
const MOVE_DOWN_BUTTON_ID = 'ptzDown'
const MOVE_LEFT_BUTTON_ID = 'ptzLeft'
const MOVE_RIGHT_BUTTON_ID = 'ptzRight'

let isHotSwitching = true

setTimeout(() => {
  console.log('PTZ Web Panel Enhancer started')
  const iframe = document.getElementById('mainframe').contentWindow.document
  
  iframe.addEventListener('keypress', event => {
    if (0 <= event.key && event.key <= 9) {
      iframe.getElementById(`${CAMERA_NUMBER_OPTION_ID_BASE}${event.key}`).click()
      if (isHotSwitching) {
        iframe.getElementById(GO_TO_POSITION_BUTTON_ID).click()
      }
    }
  })

  iframe.addEventListener('keydown', event => {
    switch (event.key) {
      case 'Home': {
        event.preventDefault()
        if (!event.repeat) {
          iframe.getElementById(`${CAMERA_NUMBER_OPTION_ID_BASE}0`).click()
          if (isHotSwitching) {
            iframe.getElementById(GO_TO_POSITION_BUTTON_ID).click()
          }
        }
        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        if (!event.repeat) {
          iframe.getElementById(MOVE_UP_BUTTON_ID).dispatchEvent(new Event('mousedown'))
        }
        break
      }
      case 'ArrowDown': {
        event.preventDefault()
        if (!event.repeat) {
          iframe.getElementById(MOVE_DOWN_BUTTON_ID).dispatchEvent(new Event('mousedown'))
        }
        break
      }
      case 'ArrowLeft': {
        event.preventDefault()
        if (!event.repeat) {
          iframe.getElementById(MOVE_LEFT_BUTTON_ID).dispatchEvent(new Event('mousedown'))
        }
        break
      }
      case 'ArrowRight': {
        event.preventDefault()
        if (!event.repeat) {
          iframe.getElementById(MOVE_RIGHT_BUTTON_ID).dispatchEvent(new Event('mousedown'))
        }
        break
      }
      case 'PageUp': {
        event.preventDefault()
        if (!event.repeat) {
          iframe.getElementById(ZOOM_IN_BUTTON_ID).dispatchEvent(new Event('mousedown'))
        }
        break
      }
      case 'PageDown': {
        event.preventDefault()
        if (!event.repeat) {
          iframe.getElementById(ZOOM_OUT_BUTTON_ID).dispatchEvent(new Event('mousedown'))
        }
        break
      }
      case '-': {
        event.preventDefault()
        --iframe.getElementById(SPEED_SLIDER_ID).value
        break
      }
      case '+': {
        event.preventDefault()
        ++iframe.getElementById(SPEED_SLIDER_ID).value
        break
      }
      case '/': {
        event.preventDefault()
        iframe.getElementById(SPEED_SLIDER_ID).value = 0
        break
      }
      case '*': {
        event.preventDefault()
        iframe.getElementById(SPEED_SLIDER_ID).value = 100
        break
      }
      case 'Shift': {
        event.preventDefault()
        if (!event.repeat) {
          isHotSwitching = !isHotSwitching
        }
        break
      }
      case ' ': {
        event.preventDefault()
        if (!event.repeat) {
          iframe.getElementById(GO_TO_POSITION_BUTTON_ID).click()
        }
        break
      }
      case 'Enter': {
        event.preventDefault()
        if (!event.repeat) {
          iframe.getElementById(SAVE_POSITION_BUTTON_ID).click()
        }
        break
      }
    }
  })


  iframe.addEventListener('keyup', event => {
    switch (event.key) {
      case 'ArrowUp': {
        event.preventDefault()
        if (!event.repeat) {
          iframe.getElementById(MOVE_UP_BUTTON_ID).dispatchEvent(new Event('mouseup'))
        }
        break
      }
      case 'ArrowDown': {
        event.preventDefault()
        if (!event.repeat) {
          iframe.getElementById(MOVE_DOWN_BUTTON_ID).dispatchEvent(new Event('mouseup'))
        }
        break
      }
      case 'ArrowLeft': {
        event.preventDefault()
        if (!event.repeat) {
          iframe.getElementById(MOVE_LEFT_BUTTON_ID).dispatchEvent(new Event('mouseup'))
        }
        break
      }
      case 'ArrowRight': {
        event.preventDefault()
        if (!event.repeat) {
          iframe.getElementById(MOVE_RIGHT_BUTTON_ID).dispatchEvent(new Event('mouseup'))
        }
        break
      }
      case 'PageUp': {
        event.preventDefault()
        if (!event.repeat) {
          iframe.getElementById(ZOOM_IN_BUTTON_ID).dispatchEvent(new Event('mouseup'))
        }
        break
      }
      case 'PageDown': {
        event.preventDefault()
        if (!event.repeat) {
          iframe.getElementById(ZOOM_OUT_BUTTON_ID).dispatchEvent(new Event('mouseup'))
        }
        break
      }
    }
  })

  addGlobalStyle(`
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
  `)

  function addGlobalStyle(css) {
    const head = iframe.getElementsByTagName('head')[0]
    if (!head) { return }
    const style = iframe.createElement('style')
    style.type = 'text/css'
    style.innerHTML = css.replace(/;/g, ' !important;')
    head.appendChild(style)
  }
}, 2000)
