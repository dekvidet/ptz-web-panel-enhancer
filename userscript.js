// ==UserScript==
// @name         PTZ Web Panel Enhancer
// @namespace    ptz-web-panel-enhancer
// @version      0.1
// @description  Add style and functionality enhancement for the Minrray PTZ web panel that controls it remotely
// @author       totymedli
// @match        localhost
// @grant        none
// ==/UserScript==

const CAMERA_SELECT_ID = ''
const GO_TO_POSITION_BUTTON_ID = ''
const SAVE_POSITION_BUTTON_ID = ''
const SPEED_SLIDER_ID = ''
const MOVE_UP_BUTTON_ID = ''
const MOVE_DOWN_BUTTON_ID = ''
const MOVE_LEFT_BUTTON_ID = ''
const MOVE_RIGHT_BUTTON_ID = ''

let isHotSwitching = true

document.addEventListener('keypress', event => {
  if (0 <= event.key && event.key <= 9) {
    document.getElementById(CAMERA_SELECT_ID).value = event.key
    if (isHotSwitching) {
      document.getElementById(GO_TO_POSITION_BUTTON_ID).click()
    }
  }
})

document.addEventListener('keydown', event => {
  console.log(event.key)
  switch (event.key) {
    case 'Home': {
      event.preventDefault()
      if (!event.repeat) {
        document.getElementById(CAMERA_SELECT_ID).value = 0
        if (isHotSwitching) {
          document.getElementById(GO_TO_POSITION_BUTTON_ID).click()
        }
      }
      break
    }
    case 'ArrowUp': {
      event.preventDefault()
      if (!event.repeat) {
        document.getElementById(MOVE_UP_BUTTON_ID).dispatchEvent(new Event('mousedown'))
      }
      break
    }
    case 'ArrowDown': {
      event.preventDefault()
      if (!event.repeat) {
        document.getElementById(MOVE_DOWN_BUTTON_ID).dispatchEvent(new Event('mousedown'))
      }
      break
    }
    case 'ArrowLeft': {
      event.preventDefault()
      if (!event.repeat) {
        document.getElementById(MOVE_LEFT_BUTTON_ID).dispatchEvent(new Event('mousedown'))
      }
      break
    }
    case 'ArrowRight': {
      event.preventDefault()
      if (!event.repeat) {
        document.getElementById(MOVE_RIGHT_BUTTON_ID).dispatchEvent(new Event('mousedown'))
      }
      break
    }
    case '-': {
      event.preventDefault()
      --document.getElementById(SPEED_SLIDER_ID).value
      break
    }
    case '+': {
      event.preventDefault()
      ++document.getElementById(SPEED_SLIDER_ID).value
      break
    }
    case '/': {
      event.preventDefault()
      document.getElementById(SPEED_SLIDER_ID).value = 0
      break
    }
    case '*': {
      event.preventDefault()
      document.getElementById(SPEED_SLIDER_ID).value = 100
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
        document.getElementById(GO_TO_POSITION_BUTTON_ID).click()
      }
      break
    }
    case 'Enter': {
      event.preventDefault()
      if (!event.repeat) {
        document.getElementById(SAVE_POSITION_BUTTON_ID).click()
      }
      break
    }
  }
})


document.addEventListener('keyup', event => {
  switch (event.key) {
    case 'ArrowUp': {
      event.preventDefault()
      if (!event.repeat) {
        document.getElementById(MOVE_UP_BUTTON_ID).dispatchEvent(new Event('mouseup'))
      }
      break
    }
    case 'ArrowDown': {
      event.preventDefault()
      if (!event.repeat) {
        document.getElementById(MOVE_DOWN_BUTTON_ID).dispatchEvent(new Event('mouseup'))
      }
      break
    }
    case 'ArrowLeft': {
      event.preventDefault()
      if (!event.repeat) {
        document.getElementById(MOVE_LEFT_BUTTON_ID).dispatchEvent(new Event('mouseup'))
      }
      break
    }
    case 'ArrowRight': {
      event.preventDefault()
      if (!event.repeat) {
        document.getElementById(MOVE_RIGHT_BUTTON_ID).dispatchEvent(new Event('mouseup'))
      }
      break
    }
  }
})

addGlobalStyle(`
.fs-subheading {
  color: red;
}
`)

function addGlobalStyle(css) {
  const head = document.getElementsByTagName('head')[0]
  if (!head) { return }
  const style = document.createElement('style')
  style.type = 'text/css'
  style.innerHTML = css.replace(/;/g, ' !important;')
  head.appendChild(style)
}
